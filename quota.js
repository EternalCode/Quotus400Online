/*
 * Quota Class - Each single Quota is modeled by this class.
 *
 */

function rd(x) {
    let val = x.toString().split(".")
    if (val.length == 1)
        return val;
    else if (parseInt(val[1][0]) >= 5)
        return parseInt(x) + 1
    else
        return parseInt(x)
}

class Quota {
	constructor(prefix, quota_name, quota_limit, question_name, question_code, nsize, nsize_override, is_dupe, flex=0, tri=false, raw=false){
		this.name = quota_name;
		this.limit = quota_limit;
		this.question_name = question_name;
		this.q_code = question_code;
		this.size = nsize;
		this.nsize_override = nsize_override;
		this.prefix = prefix;
		this.flex = flex;
		this.isactive = true;
		this.tri = tri;
		this.raw = raw;
		this.counter_limit = 999;
		this.fullname = this.prefix + " - " + this.name;
		this.calculated = false;
		this.max = 0;
		this.delta = 0;
		this.is_duplicate = is_dupe;
		this.action = TERMWARN ? 2 : 1;
        this.isCounter = false;
        if (this.name.includes("(counter)")) {
            // counter
            this.name = this.name.replace("(counter)", "");
            this.name += " Min: ";
            this.fullname = this.prefix + " - " + this.name;
            this.isCounter = true;
            let temp = [];
            for (let i = 0; i < NSIZE.toString().length; i++) {
                temp.push("9");
            }
            this.counter_limit = parseInt(temp.join(""));
        }

		if (this.flex > 0 && (this.max + this.delta) > 0)
			this.fullname += " - Flex(" + (this.flex).toString() + "%)" + (CLIENT == "EFMMM" ? (" - added " + (this.delta).toString()) : "";
		if (this.fullname.toLowerCase().includes("split"))
			this.isactive = false;
	}

	validify() {
		if (this.limit == 0) {
			this.isactive = false;
		} else if (this.limit == -1) {
			this.isactive = false;
			this.limit = this.counter_limit;
		}
		if (this.fullname.toLowerCase().includes("offsetter"))
            this.isactive = false
	}

	calculate_limit(nsize=undefined){
		this.validify()

		if(this.calculated)
			return;
		if (this.raw)
			return;
		if (this.limit == this.counter_limit)
			return;
		let size = this.size;
		if (nsize != undefined)
			size = nsize;
		this.limit = (size * (this.limit / 100));
		this.max = this.limit;
		// flex
		if (this.flex > 0) {
			this.delta = rd((this.flex / 100) * size);
			this.limit += this.delta;
			this.fullname += " - Flex(" + (this.flex).toString() + "%)" + (CLIENT == "EFMMM" ? (" - added " + (this.delta).toString()) : "";
		}
		this.limit = rd(this.limit);
		this.calculated = true;
	}

	display() {
		let simple = "Simple";
		let data = "";
		let nlow = this.fullname.toLowerCase();
		this.limit = parseInt(this.limit);
		if (nlow.includes("dnq") || nlow.includes("reschedule"))
			this.limit = 0;
		else if (this.limit < 5)
			this.isactive = false;
		if (this.tri)
			this.isactive = false;
        if (this.isCounter) {
            this.fullname += this.limit;
            this.limit = this.counter_limit;
            this.active = false;
        }
        if (this.flex > 0) {
            this.limit += parseInt(this.delta);
        }

		let quota_settings = '"{""action"":""1"",""autoload_url"":""1"",""active"":""' + (this.isactive ? 1 : 0) + '"",""qls"":[{""quotals_language"":""en"",""quotals_name"":""x"",""quotals_url"":"""",""quotals_urldescrip"":"""",""quotals_message"":""Sorry your responses have exceeded a quota on this survey.""}]}"'
		let quota_settings_dnq = '"{""action"":""' + this.action + '"",""autoload_url"":""1"",""active"":""1"",""qls"":[{""quotals_language"":""en"",""quotals_name"":""x"",""quotals_url"":"""",""quotals_urldescrip"":"""",""quotals_message"":""Thank and Terminate.""}]}"'
		let quota_settings_dnq_online = '"{""action"":""' + this.action + '"",""autoload_url"":""1"",""active"":""1"",""qls"":[{""quotals_language"":""en"",""quotals_name"":""x"",""quotals_url"":"""",""quotals_urldescrip"":"""",""quotals_message"":""Thank you for your time.""}]}"'
		let quota_settings_reschedule = '"{""action"":""' + this.action + '"",""autoload_url"":""1"",""active"":""1"",""qls"":[{""quotals_language"":""en"",""quotals_name"":""x"",""quotals_url"":"""",""quotals_urldescrip"":"""",""quotals_message"":""Reschedule and end call.""}]}"'

		if (nlow.toLowerCase().includes("reschedule")) {
			data = (this.fullname + "," + simple + "," + this.question_name + "," + this.q_code + "," + this.limit + "," + quota_settings_reschedule);
		} else if (this.fullname.toLowerCase().includes("dnq")) {
			if (nlow.includes("email") || nlow.includes("text") || nlow.includes("online")) {
				data = (this.fullname + "," + simple + "," + this.question_name + "," + this.q_code + "," + this.limit + "," + quota_settings_dnq_online);
			} else {
				data = (this.fullname + "," + simple + "," + this.question_name + "," + this.q_code + "," + this.limit + "," + quota_settings_dnq);
			}
		} else {
			data = (this.fullname + "," + simple + "," + this.question_name + "," + this.q_code + "," + this.limit + "," + quota_settings);
		}
		return data + "\n";
	}
}
