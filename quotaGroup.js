// Assumptions
//
// Phonetype: 1 = Landline, 2 = Cellphone
// Mode: 1 = Phone, 2 = Email, 3 = Text

/*
 * Quota Group -  Quotas a grouped into a group which contains settings and debug related info for the group
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

class QuotaGroup {
	constructor( group_name, trisplit, flex, raw, cli, nsize, tri_sizes, dual) {
        this.group_name = group_name;
        this.trisplit = trisplit;
        this.flex = parseInt(flex);
        this.raw = raw;
        this.client = cli;
        this.nSize = parseInt(nsize);
        this.tri_sizes = tri_sizes;
        this.quotas = [];
        this.limits = [];
        this.names = [];
        this.dual = dual;
        this.splitQuotas = false;
    }

    get_name() {
        return this.group_name;
    }

    SplitByMode(mode, splitInfo, sname, quota_name, quota_limit, question_name, question_code, nsize_override, flex) {
        switch (mode) {
            case 0:
                {
                    let q = new Quota(this.get_name(), quota_name + "- Split " + sname, parseFloat(quota_limit * splitInfo[0]), question_name, question_code, this.nSize, nsize_override, true, flex, mode==2, this.raw);
                    this.quotas.push(q);
                    q = new Quota(this.get_name(), quota_name + "- Split " + sname, parseFloat(quota_limit * splitInfo[0]), splitInfo[2], splitInfo[1], this.nSize, nsize_override, true, flex, mode==2, this.raw);
                    this.quotas.push(q);
                    break;
                }
            case 1:
                {
                    // Phone
                    let q = new Quota(this.get_name(), quota_name + "- Phone - Split " + sname, parseFloat(quota_limit * splitInfo[0]), question_name, question_code, this.nSize, nsize_override, true, flex, mode==2, this.raw);
                    q.calculate_limit(DUALMODE_SIZE[0]);
                    this.quotas.push(q);
                    q = new Quota(this.get_name(), quota_name + "- Phone - Split " + sname, parseFloat(quota_limit) * splitInfo[0], splitInfo[2], splitInfo[1], this.nSize, nsize_override, true, flex, mode==2, this.raw);
                    q.calculate_limit(DUALMODE_SIZE[0]);
                    this.quotas.push(q);
                    q = new Quota(this.get_name(), quota_name + "- Phone - Split " + sname, parseFloat(quota_limit) * splitInfo[0], "pMode", 1, this.nSize, nsize_override, true, flex, mode==2, this.raw);
                    q.calculate_limit(DUALMODE_SIZE[0]);
                    this.quotas.push(q);
                    // Email
                    q = new Quota(this.get_name(), quota_name + "- Email - Split " + sname, parseFloat(quota_limit * splitInfo[0]), question_name, question_code, this.nSize, nsize_override, true, flex, mode==2, this.raw);
                    q.calculate_limit(DUALMODE_SIZE[1]);
                    this.quotas.push(q);
                    q = new Quota(this.get_name(), quota_name + "- Email - Split " + sname, parseFloat(quota_limit) * splitInfo[0], splitInfo[2], splitInfo[1], this.nSize, nsize_override, true, flex, mode==2, this.raw);
                    q.calculate_limit(DUALMODE_SIZE[1]);
                    this.quotas.push(q);
                    q = new Quota(this.get_name(), quota_name + "- Email - Split " + sname, parseFloat(quota_limit) * splitInfo[0], "pMode", 2, this.nSize, nsize_override, true, flex, mode==2, this.raw);
                    q.calculate_limit(DUALMODE_SIZE[1]);
                    this.quotas.push(q);
                    break;
                }
            case 2:
                {
                    // Phone
                    let q = new Quota(this.get_name(), quota_name + "- Phone - Split " + sname, parseFloat(quota_limit) * splitInfo[0], question_name, question_code, this.nSize, nsize_override, true, flex, mode==2, this.raw);
                    q.calculate_limit(TRIMODE_SIZE[0]);
                    this.quotas.push(q);
                    q = new Quota(this.get_name(), quota_name + "- Phone - Split " + sname, parseFloat(quota_limit) * splitInfo[0], splitInfo[2], splitInfo[1], this.nSize, nsize_override, true, flex, mode==2, this.raw);
                    q.calculate_limit(TRIMODE_SIZE[0]);
                    this.quotas.push(q);
                    q = new Quota(this.get_name(), quota_name + "- Phone - Split " + sname, parseFloat(quota_limit) * splitInfo[0], "pMode", 1, this.nSize, nsize_override, true, flex, mode==2, this.raw);
                    q.calculate_limit(TRIMODE_SIZE[0]);
                    this.quotas.push(q);
                    // Email
                    q = new Quota(this.get_name(), quota_name + "- Email - Split " + sname, parseFloat(quota_limit) * splitInfo[0], question_name, question_code, this.nSize, nsize_override, true, flex, mode==2, this.raw);
                    q.calculate_limit(TRIMODE_SIZE[1]);
                    this.quotas.push(q);
                    q = new Quota(this.get_name(), quota_name + "- Email - Split " + sname, parseFloat(quota_limit) * splitInfo[0], splitInfo[2], splitInfo[1], this.nSize, nsize_override, true, flex, mode==2, this.raw);
                    q.calculate_limit(TRIMODE_SIZE[1]);
                    this.quotas.push(q);
                    q = new Quota(this.get_name(), quota_name + "- Email - Split " + sname, parseFloat(quota_limit) * splitInfo[0], "pMode", 2, this.nSize, nsize_override, true, flex, mode==2, this.raw);
                    q.calculate_limit(TRIMODE_SIZE[1]);
                    this.quotas.push(q);
                    // Text
                    q = new Quota(this.get_name(), quota_name + "- Text - Split " + sname, parseFloat(quota_limit) * splitInfo[0], question_name, question_code, this.nSize, nsize_override, true, flex, mode==2, this.raw);
                    q.calculate_limit(TRIMODE_SIZE[2]);
                    this.quotas.push(q);
                    q = new Quota(this.get_name(), quota_name + "- Text - Split " + sname, parseFloat(quota_limit) * splitInfo[0], splitInfo[2], splitInfo[1], this.nSize, nsize_override, true, flex, mode==2, this.raw);
                    q.calculate_limit(TRIMODE_SIZE[2]);
                    this.quotas.push(q);
                    q = new Quota(this.get_name(), quota_name + "- Text - Split " + sname, parseFloat(quota_limit) * splitInfo[0], "pMode", 3, this.nSize, nsize_override, true, flex, mode==2, this.raw);
                    q.calculate_limit(TRIMODE_SIZE[2]);
                    this.quotas.push(q);
                    break;
                }
        };
    }

    generateSplitQuotas(mode, splitdepth, quota_name, quota_limit, question_name, question_code, nsize_override, flex) {
        let combs = [];
        for (let i = 1; i <= SPLITDEPTH.length; i++) {
            combs.push(k_combinations(SPLITDEPTH, i));
        }

        let splitsToProcess = [];
        for (let i = 0; i < combs.length; i++) {
            for (let j = 0; j < combs[i].length; j++) {
                splitsToProcess.push(SplitCombinations(combs[i][j]));
            }
        }

        for (let i = 0; i < splitsToProcess.length; i++) {
            for (let j = 0; j < splitsToProcess[i].length; j++) {
                let splitID = splitsToProcess[i][j];
                // check if the Split ID is contained in the Split depth
                let flagIncluded = false;
                for (let k = 0; k < SPLITDEPTH.length; k++) {
                    if (SPLITDEPTH[k].includes(splitID)) {
                        // if the ID is included, no problem
                        flagIncluded = true;
                    }
                }
                if (!flagIncluded) {
                    for (let c = 0; c < splitID.length; c++) {
                        let splitInfo = GetSplitMuliplier(splitID[c]);
                        splitInfo[0] = splitInfo[0] / splitID.length;
                        this.SplitByMode(mode, splitInfo, splitsToProcess[i][j], quota_name, quota_limit, question_name, question_code, nsize_override, flex);
                    }
                } else {
                    // from the split ID, figure out which split it belongs to
                    let splitInfo = GetSplitMuliplier(splitID);
                    this.SplitByMode(mode, splitInfo, splitsToProcess[i][j], quota_name, quota_limit, question_name, question_code, nsize_override, flex);
                }
            }
        }
    }


    add_quota(quota_name, quota_limit, question_name, question_code, nsize_override, expand=true) {
        let flex = 0
        if (this.flex > 0)
            flex = this.flex
        if (CLIENT == "tulchin") {
            // for the same quota, Tulchin wants a online, cell, and landline if it is a DNQ
            if (this.get_name().toLowerCase().includes("dnq")) {
                let q = new Quota(this.get_name(), quota_name, parseFloat(quota_limit), question_name, question_code, this.nSize, nsize_override, !(expand), flex, this.trisplit, this.raw);
                this.quotas.push(q);
                q = new Quota(this.get_name(), quota_name + " - Landline", parseFloat(quota_limit), question_name, question_code, this.nSize, nsize_override, !(expand), flex, this.trisplit, this.raw);
                this.quotas.push(q);
                q = new Quota(this.get_name(), quota_name + " - Cell", parseFloat(quota_limit), question_name, question_code, this.nSize, nsize_override, !(expand), flex, this.trisplit, this.raw);
                this.quotas.push(q);
                q = new Quota(this.get_name(), quota_name + " - Online", parseFloat(quota_limit), question_name, question_code, this.nSize, nsize_override, !(expand), flex, this.trisplit, this.raw);
                this.quotas.push(q);
                // add the mode specifiers only once
                if (expand) {
                    q = new Quota(this.get_name(), quota_name + " - Landline", parseFloat(quota_limit), "pMode", 1, this.nSize, nsize_override, true, flex, this.trisplit, this.raw);
                    this.quotas.push(q);
                    q = new Quota(this.get_name(), quota_name + " - Landline", parseFloat(quota_limit), "PhoneType", 1, this.nSize, nsize_override, true, flex, this.trisplit, this.raw);
                    this.quotas.push(q);
                    q = new Quota(this.get_name(), quota_name + " - Cell", parseFloat(quota_limit), "pMode", 1, this.nSize, nsize_override, true, flex, this.trisplit, this.raw);
                    this.quotas.push(q);
                    q = new Quota(this.get_name(), quota_name + " - Cell", parseFloat(quota_limit), "PhoneType", 2, this.nSize, nsize_override, true, flex, this.trisplit, this.raw);
                    this.quotas.push(q);
                    q = new Quota(this.get_name(), quota_name + " - Online", parseFloat(quota_limit), "pMode", 2, this.nSize, nsize_override, true, flex, this.trisplit, this.raw);
                    this.quotas.push(q);
                    q = new Quota(this.get_name(), quota_name + " - Online", parseFloat(quota_limit), "pMode", 3, this.nSize, nsize_override, true, flex, this.trisplit, this.raw);
                    this.quotas.push(q);
                } else if (SPLITAB == true && this.splitQuotas && !expand) {
                    this.generateSplitQuotas(0, SPLITDEPTH, quota_name, quota_limit, question_name, question_code, nsize_override, flex);
                }
            } else {
                let q = new Quota(this.get_name(), quota_name, parseFloat(quota_limit), question_name, question_code, this.nSize, nsize_override, !(expand), flex, this.trisplit, this.raw);
                this.quotas.push(q);
            }
            if (expand)
                this.limits.push(parseFloat(quota_limit));
        } else if (this.dual) {
            // Dual modes are Phone and Email.
            let q = new Quota(this.get_name(), quota_name + " - Phone", parseFloat(quota_limit), question_name, question_code, this.nSize, nsize_override, !(expand), flex, this.trisplit, this.raw);
            q.calculate_limit(DUALMODE_SIZE[0]);
            q.isactive = false;
            this.quotas.push(q);
            q = new Quota(this.get_name(), quota_name + " - Phone", parseFloat(quota_limit), "pMode", 1, this.nSize, nsize_override, !(expand), flex, this.trisplit, this.raw);
            q.calculate_limit(DUALMODE_SIZE[0]);
            q.isactive = false;
            this.quotas.push(q);
            q = new Quota(this.get_name(), quota_name + " - Email", parseFloat(quota_limit), question_name, question_code, this.nSize, nsize_override, !(expand), flex, this.trisplit, this.raw);
            q.calculate_limit(DUALMODE_SIZE[1]);
            q.isactive = false;
            this.quotas.push(q);
            q = new Quota(this.get_name(), quota_name + " - Email", parseFloat(quota_limit), "pMode", 2, this.nSize, nsize_override, !(expand), flex, this.trisplit, this.raw);
            q.calculate_limit(DUALMODE_SIZE[1]);
            q.isactive = false;
            this.quotas.push(q);
            // if show split quotas, then generate them
            if (SPLITAB == true && this.splitQuotas && expand) {
                this.generateSplitQuotas(1, SPLITDEPTH, quota_name, quota_limit, question_name, question_code, nsize_override, flex);
            }
            if (expand)
                this.limits.push(parseFloat(quota_limit));
        } else if (this.trisplit == false) {
            // Regular single mode quotas
            let q = new Quota(this.get_name(), quota_name, parseFloat(quota_limit), question_name, question_code, this.nSize, nsize_override, !(expand), flex, this.trisplit, this.raw);
            this.quotas.push(q);
            if (expand)
                this.limits.push(parseFloat(quota_limit))
            if (SPLITAB == true && this.splitQuotas && expand) {
                this.generateSplitQuotas(0, SPLITDEPTH, quota_name, quota_limit, question_name, question_code, nsize_override, flex);
            }
        } else {
            // tri split quotas include (Phone, email, text)->(this)(pMode)
            if (expand)
                this.limits.push(parseFloat(quota_limit))
            let q = new Quota(this.get_name(), quota_name + "- Phone", parseFloat(quota_limit), question_name, question_code, this.nSize, nsize_override, !(expand), flex, this.trisplit, this.raw);
            q.calculate_limit(TRIMODE_SIZE[0]);
            this.quotas.push(q);
            q = new Quota(this.get_name(), quota_name + "- Email", parseFloat(quota_limit), question_name, question_code, this.nSize, nsize_override, !(expand), flex, this.trisplit, this.raw);
            q.calculate_limit(TRIMODE_SIZE[1]);
            this.quotas.push(q);
            q = new Quota(this.get_name(), quota_name + "- Text", parseFloat(quota_limit), question_name, question_code, this.nSize, nsize_override, !(expand), flex, this.trisplit, this.raw);
            q.calculate_limit(TRIMODE_SIZE[2]);
            this.quotas.push(q);
            if (SPLITAB == true && this.splitQuotas && expand) {
                this.generateSplitQuotas(2, SPLITDEPTH, quota_name, quota_limit, question_name, question_code, nsize_override, flex);
            }
            // add mode specifiers only once
            if (expand) {
                q = new Quota(this.get_name(), quota_name + "- Phone", parseFloat(quota_limit), "pMode", 1, this.nSize, nsize_override, true, flex, this.trisplit, this.raw);
                q.calculate_limit(TRIMODE_SIZE[0]);
                this.quotas.push(q);
                q = new Quota(this.get_name(), quota_name + "- Email", parseFloat(quota_limit), "pMode", 2, this.nSize, nsize_override, true, flex, this.trisplit, this.raw);
                q.calculate_limit(TRIMODE_SIZE[1]);
                this.quotas.push(q);
                q = new Quota(this.get_name(), quota_name + "- Text", parseFloat(quota_limit), "pMode", 3, this.nSize, nsize_override, true, flex, this.trisplit, this.raw);
                q.calculate_limit(TRIMODE_SIZE[2]);
                this.quotas.push(q);
            }
        }
    }

    validate_quotas() {
        for (let i = 0; i < this.quotas.length; i++) {
            let quota = this.quotas[i];
            let count = 0;
            // check quota names are unique
            for (let j = 0; j < this.quotas.length; j++) {
                if (quota.fullname == this.quotas[j].fullname && (this.quotas[j].is_duplicate == false) &&
                     (quota.question_name == this.quotas[j].question_name)) {
                         if (count > 0)
                            console.log("same, ", quota, this.quotas[j]);
                         count += 1;
                     }
            }

            if (count > 1)
                WARNINGS.push("WARNING: Quota with the name '" + quota.fullname + "' repeated in group '" + this.get_name() + "'");
            // quotas with 0% quota limit must be set to a counter
            if (quota.limit == 0 && !(quota.fullname.toLowerCase().includes("dnq")) && !(quota.fullname.toLowerCase().includes("reschedule")))
                WARNINGS.push("WARNING: Quota '" + quota.fullname + "' in group '" + this.get_name() + "' limit percentage is 0. Quota limit will be set to 0 and made inactive");
        }
        // check percentages add up to 100, if group isn't a DNQ/Reschedule
        if (!((this.group_name.toLowerCase().includes("dnq") || this.group_name.toLowerCase().includes("reschedule")))) {
            let sum = 0;
            for (let i = 0; i < this.limits.length; i++) {
                if (this.limits[i] != -1)
                    sum += this.limits[i];
            }
            if (sum != 100) {
                if (!this.raw) {
                    WARNINGS.push("WARNING: Sum of percentages in quota: '" + this.get_name() + "' Do not add up to 100% at: " + sum +"%");
                } else {
                    sum = 0;
                    for (let i = 0; i < this.quotas.length; i++) {
                        sum += this.quotas[i].limit;
                    }
                    if (sum != NSIZE)
                        WARNINGS.push("WARNING: Sum of raw limits don't add to the end size of " + NSIZE + " at " + sum);
                }
            }
        }
        for (let i = 0; i < this.quotas.length; i++) {
            this.quotas[i].calculate_limit();
        }
        if (WARNINGS.length > 0) {
            WARNINGS.sort();
        }
        DisplayWarnings();
        console.log("w: ", WARNINGS);
        return WARNINGS.length;
    }

    display_quotas() {
        // sort quotas by Question name
        this.quotas.sort((a,b) => (a.question_name > b.question_name) ? 1 : ((b.question_name > a.question_name) ? -1 : 0));
        // sort quotas by Question code
        this.quotas.sort((a,b) => (a.q_code > b.q_code) ? 1 : ((b.q_code > a.q_code) ? -1 : 0));
        //sort quotas by Quota name
        this.quotas.sort((a,b) => (a.fullname > b.fullname) ? 1 : ((b.fullname > a.fullname) ? -1 : 0));
        let group_data = ""
        for (let i = 0; i < this.quotas.length; i++) {
            group_data += this.quotas[i].display();
        }
        return group_data;
    }
}

function SplitCombinations(splits) {
    if (splits.length == 0) {
        return [];
    } else if (splits.length == 1) {
        return splits[0];
    } else {
        var result = [];
        var allCasesOfRest = SplitCombinations(splits.slice(1));
        for (var c in allCasesOfRest) {
            for (var i = 0; i < splits[0].length; i++) {
                result.push(splits[0][i] + allCasesOfRest[c]);
            }
        }
        return result;
    }
}

const k_combinations = (set, k) => {
    if (k > set.length || k <= 0) {
        return []
    }
    if (k == set.length) {
        return [set]
    }
    if (k == 1) {
        return set.reduce((acc, cur) => [...acc, [cur]], [])
    }
    let combs = [], tail_combs = []
    for (let i = 0; i <= set.length - k + 1; i++) {
        tail_combs = k_combinations(set.slice(i + 1), k - 1)
        for (let j = 0; j < tail_combs.length; j++) {
            combs.push([set[i], ...tail_combs[j]])
        }
    }
    return combs
}

const combinations = set => {
    return set.reduce((acc, cur, idx) => [...acc, ...k_combinations(set, idx + 1)], [])
}

function GetSplitMuliplier(splitID) {
    for (let k = 0; k < SPLITDEPTH.length; k++) {
        for (let s = 0; s < SPLITDEPTH[k].length; s++) {
            if (SPLITDEPTH[k][s] == splitID) {
                let splitname = "Split" + SPLITDEPTH[k].join("");
                return [(100 / SPLITDEPTH[k].length) / 100, s + 1, splitname];
            }
        }
    }
}
