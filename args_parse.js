var NSIZE;
var TRIMODE_SIZE;
var DUALMODE_SIZE;
var SPLITAB;
var TERMWARN;
var CLIENT;
var WARNINGS = [];
var QUOTA_GROUPS = [];
var SPLITDEPTH = [];
var INCPHONETYPE;
var full_data;
var ClientSelected = 0;
var ClientNameBuff = ["", "TUL", "EFMMM", "Easymc"];

function SelectClient(n) {
	ClientSelected = n;
}


function ProcessInput() {
	// reparse all arguments
	WARNINGS = [];
	SPLITDEPTH = [];
	WARNINGS.push("<h3>DATA VALIDATION RESULTS:</h3>");
	let toDisplay = ""
	NSIZE = parseInt(document.getElementById("EndSize").value);
	if (isNaN(NSIZE)) {
		alert("Couldn't parse End size field. Field is manditory, please ensure it's a number.");
		return;
	}
	TRIMODE_SIZE = document.getElementById("TrimodeSizes").value;
	DUALMODE_SIZE = document.getElementById("DualmodeSizes").value;
	INCPHONETYPE = document.getElementById("PhoneType").value;
	CLIENT = ClientNameBuff[ClientSelected];
	SPLITAB = document.getElementById("enableSplitAB").checked;
	let splitval = document.getElementById("SplitModes").value;
	if (CLIENT == "EFMMM") {
		INCPHONETYPE = [30, 70];
	} else {
		if (INCPHONETYPE == "") {
			// what should happen ?
		} else {
			INCPHONETYPE = INCPHONETYPE.split("%").join("").split(" ").join("").split(",");
		}
	}


	if (SPLITAB && splitval == "") {
		alert("Splits enabled without specifications on what the splits are. Please fill out the Splits form.");
		return;
	} else {
		splitval = splitval.split(" ").join("").split(",");
		for (let i = 0; i < splitval.length; i++) {
			// loop through each split type
			let individualSplits = [];
			for (let j = 0; j < splitval[i].length; j++) {
				// get each split name
				individualSplits.push(splitval[i][j]);
			}
			SPLITDEPTH.push(individualSplits);
		}
	}
	TERMWARN = document.getElementById("TermWarn").checked;

	// process mode args
	if (TRIMODE_SIZE != "") {
		TRIMODE_SIZE = TRIMODE_SIZE.split("-");
		let total = 0;
		for (let i = 0; i < TRIMODE_SIZE.length; i++) {
			TRIMODE_SIZE[i] = parseInt(TRIMODE_SIZE[i]);
			total += TRIMODE_SIZE[i];
		}
		if (total != NSIZE)
			toDisplay += ("<b>ERROR:</b> Trimode split sizes do not add up to the end size. Expecting " + NSIZE + " recieved " + total);
	} else {
		TRIMODE_SIZE = [NSIZE, NSIZE, NSIZE];
		toDisplay += ("<b>IMPORTANT:</b> Trimode N-sizes not defined, defaulting each to " + NSIZE) + "<br>";
	}

	if (DUALMODE_SIZE != "") {
		DUALMODE_SIZE = DUALMODE_SIZE.split("-");
		let total = 0;
		for (let i = 0; i < DUALMODE_SIZE.length; i++) {
			DUALMODE_SIZE[i] = parseInt(DUALMODE_SIZE[i]);
			total += DUALMODE_SIZE[i];
		}
		if (total != NSIZE)
			toDisplay += ("<b>ERROR:</b> Dualmode split sizes do not add up to the end size. Expecting " + NSIZE + " recieved " + total);
	} else {
		DUALMODE_SIZE = [NSIZE, NSIZE];
		toDisplay += ("<b>IMPORTANT:</b> Dual mode N-sizes not defined, defaulting each to " + NSIZE) + "<br>";
	}

	if (CLIENT != "")
		CLIENT = CLIENT.toLowerCase();
	if (toDisplay != "")
		WARNINGS.push(toDisplay);
	if (WARNINGS.length == 0)
		WARNINGS.push("Arguments Parsed - All Good.");
	DisplayWarnings();
	// clear the current button buffer
	document.getElementById("ButtonBuffer").innerHTML = "";
	// continue button
	$("button#continue1").remove();
	$("button#continue2").remove();
	$("button#continue3").remove();
	let buttonHTML = '<button type="submit" class="btn btn-primary mb-2" id="continue1" onClick=ProcessData()>Continue</button>'
	$("div#ButtonBuffer").append(buttonHTML);
}

function DisplayWarnings() {
	let message = "";
	for (let i = 0; i < WARNINGS.length; i++) {
		message += WARNINGS[i] + "<br>";
	}
	// write
	document.getElementById("WarningBuffer").innerHTML = message + "<br><br>";
}

function CreateContinueButton() {
	$("button#continue1").remove();
	$("button#continue2").remove();
	$("button#continue3").remove();
	let buttonHTML = '<button type="submit" class="btn btn-primary mb-2" id="continue2" onClick=DownloadCSV() >Acknowledged Warnings & Download CSV</button>'
	$("div#ButtonBuffer").append(buttonHTML);
	ViewRawData();
}

function CreateDownloadButton() {
	$("button#continue1").remove();
	$("button#continue2").remove();
	$("button#continue3").remove();
	let buttonHTML = '<button type="submit" class="btn btn-primary mb-2" id="continue2" onClick=DownloadCSV()>Download CSV</button>'
	$("div#ButtonBuffer").append(buttonHTML);
	ViewRawData();
}

function ViewRawData() {
	let viewHTML = '<button class="btn btn-primary" type="button" data-toggle="collapse" id="continue3" data-target="#collapseQuota" aria-expanded="false" aria-controls="collapseQuota">'
	viewHTML += "View Here";
	viewHTML += '</button>';
	viewHTML += '<div class="collapse" id="collapseQuota">';
	viewHTML += '<div class="card card-body" align="left" overflow: auto;>';
	viewHTML += full_data.split("\n").join("<br>");
    viewHTML += '</div>'
    viewHTML += '</div>'
	$("button#continue1").remove();
	$("button#continue3").remove();
	$("div#ButtonBuffer").append(viewHTML);
}
