// Program
function ProcessData() {
    // Program logic vars
    let trisplit = false;
    let isdual = false;
    let gflex = 0;
    let is_raw = false;
    let q_prefix = "";
    let isSplit = true;

    QUOTA_GROUPS = [];

    /* Read form content */
    contents = document.getElementById("quotusInput").value;
    contents = contents.split("%").join("").split("\n");
    for (let i = 0; i < contents.length; i++) {
        // if a line is empty, toss it
        let line = contents[i];
        if (line == "")
            continue;
        // reset logic globals
        trisplit = false;
        isdual = false;
        gflex = 0;
        is_raw = false;
        q_prefix = "";
        isSplit = true;
        line = line.trim().split("\t");
        // if a line contains only 1 thing, or attempt to parse a Quota group
        if (line.length == 1) {
            line = line[0];
            // dual and tri mode are mutually exclusive
            if (line.includes("(tri)")) {
                // tri mode
                line = line.split("(tri)").join("");
                trisplit = true;
            } else if (line.includes("(dual)")) {
                // dual mode
                line = line.split("(dual)").join("");
                isdual = true;
            }
            if (line.includes("(us)")) {
                // un-split
                line = line.replace("(us)", "");
                isSplit = false;
            }
            if (line.includes("(flex ")) {
                // flex
                // get the flex percentage
                gflex = parseInt(line.match("flex ([0-9][0-9]*)")[0].replace("flex", ""));
                // adjust the string
                line = line.replace(/\(flex [0-9][0-9]*\)/gi,"");
            }
            if (line.includes("(raw)")) {
                // raw
                line = line.replace("(raw)", "");
                is_raw = true;
            }
            // group name
            q_prefix = line;//line.split(" ")[0]
            QUOTA_GROUPS.push(new QuotaGroup(q_prefix, trisplit, gflex, is_raw, CLIENT, NSIZE, TRIMODE_SIZE, isdual));
            if (SPLITAB == true) {
                QUOTA_GROUPS[QUOTA_GROUPS.length-1].splitQuotas = isSplit;
            }
        } else {
            // Empty percentage means 0
            if (line[1] == "")
                line[1] = 0;
            let question_code = line[3].replace(" ", "").split(",");
            quota_grp = QUOTA_GROUPS[QUOTA_GROUPS.length-1];
            if (question_code.length == 1) {
                quota_grp.add_quota(line[0], parseFloat(line[1]), line[2], question_code[0], trisplit);
            } else {
                for (let j = 0; j < question_code.length; j++) {
                    QUOTA_GROUPS[QUOTA_GROUPS.length-1].add_quota(line[0], parseFloat(line[1]), line[2], question_code[j], trisplit, j==0);
                    if (j > 0)
                        quota_grp.quotas[quota_grp.quotas.length - 1].is_duplicate = true;
                }
            }
        }
    }
    WARNINGS = [];
    WARNINGS.push("<h3>DATA VALIDATION RESULTS:</h3>");
    let sum = 0;
    for (let i = 0; i < QUOTA_GROUPS.length; i++) {
        sum += QUOTA_GROUPS[i].validate_quotas();
    }

    full_data = '"Quota Name",Type,"Question Code","Option Code","Quota Limit","Quota Settings"' + "\n";
    for (let i = 0; i < QUOTA_GROUPS.length; i++) {
        full_data += QUOTA_GROUPS[i].display_quotas();
    }
    if (sum == 0) {
        WARNINGS.push("<b>All OK.</b>");
        CreateDownloadButton();
    } else {
        CreateContinueButton();
    }
    DisplayWarnings();
}

function DownloadCSV(filename="YourFilename.csv") {
    let csvFile;
    let downloadLink;

	if (window.Blob == undefined || window.URL == undefined || window.URL.createObjectURL == undefined) {
		alert("Your browser doesn't support Blobs");
		return;
	}

    csvFile = new Blob([full_data], {type:"text/csv"});
    downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
}
