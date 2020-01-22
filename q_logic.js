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
            QUOTA_GROUPS[QUOTA_GROUPS.length-1].splitQuotas = SPLITAB;
        } else if (line[0].toLowerCase().includes("(lake")) {
            let regCount = parseInt(line[0].match("\(lake ([0-9][0-9]*)\)")[0].replace("lake", ""));
            let header = line;
            let lakeTable = [];

            for (let j = i + 1; j < i + regCount + 1; j++) {
                lakeTable.push(contents[j].trim().split("\t"));
            }

            let gender = parseInt(lakeTable[0].splice(0, 1)[0]);
            header[0] = header[0].replace(/\(lake [0-9][0-9]*\)/gi,"");
            header.splice(0, 2);
            QUOTA_GROUPS.push(new QuotaGroup("Table", trisplit, gflex, true, CLIENT, NSIZE, TRIMODE_SIZE, isdual));
            let quota_grp = QUOTA_GROUPS[QUOTA_GROUPS.length-1];
            quota_grp.splitQuotas = false;
            let regions = []
            for (let k = 0; k < regCount; k++) {
                regions.push(lakeTable[k].splice(0, 1));
            }
            for (let l = 0; l < header.length; l++) {
                for (let k = 0; k < regCount; k++) {
                    let quota_name = gender == 1 ? "Male " : "Female ";
                    quota_name += regions[k] + " ";
                    quota_name += header[l];
                    let limit = parseInt(lakeTable[k].splice(0, 1));
                    quota_grp.add_quota(quota_name, limit, "pGender", gender, false, false);
                    quota_grp.add_quota(quota_name, limit, "pRegion", k+1, false, false);
                    for (let c = 0; c < header[l].length; c++) {
                        let splitID = header[l][c];
                        for (let m = 0; m < SPLITDEPTH.length; m++) {
                            for (let n = 0; n < SPLITDEPTH[m].length; n++) {
                                if (SPLITDEPTH[m][n] == splitID) {
                                    console.log(quota_name, limit, "Split" + SPLITDEPTH[m].join(""), n);
                                    //(quota_name, quota_limit, question_name, question_code, nsize_override, expand=true)
                                    quota_grp.add_quota(quota_name, limit, "Split" + SPLITDEPTH[m].join(""), n, false, false);
                                }
                            }
                        }
                    }
                }
            }
            i += regCount + 1;
        } else {
            // Empty percentage means 0
            if (line[1] == "")
                line[1] = 0;
            let question_code = line[3].replace(" ", "").split(",");
            let quota_grp = QUOTA_GROUPS[QUOTA_GROUPS.length-1];
            if (question_code.length == 1) {
                quota_grp.add_quota(line[0], parseFloat(line[1]), line[2], question_code[0], trisplit, true);
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
    let sum = 0;
    for (let i = 0; i < QUOTA_GROUPS.length; i++) {
        sum += QUOTA_GROUPS[i].validate_quotas();
    }

    full_data = '"Quota Name",Type,"Question Code","Option Code","Quota Limit","Quota Settings"' + "\n";
    for (let i = 0; i < QUOTA_GROUPS.length; i++) {
        full_data += QUOTA_GROUPS[i].display_quotas();
    }
    WARNINGS.push("<h3>DATA VALIDATION RESULTS:</h3>");
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
