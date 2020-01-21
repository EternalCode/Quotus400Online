var NSIZE;
var TRIMODE_SIZE;
var DUALMODE_SIZE;
var SPLITAB;
var TERMWARN;
var CLIENT;
var WARNINGS = [];

function ProcessInput() {
	// reparse all arguments
	WARNINGS = [];
	let toDisplay = ""
	NSIZE = parseInt(document.getElementById("EndSize").value);
	if (isNaN(NSIZE)) {
		alert("Couldn't parse End size field. Field is manditory, please ensure it's a number.");
		return;
	}
	TRIMODE_SIZE = document.getElementById("TrimodeSizes").value;
	DUALMODE_SIZE = document.getElementById("DualmodeSizes").value;
	CLIENT = document.getElementById("clientName").value;
	SPLITAB = document.getElementById("enableSplitAB").checked;
	TERMWARN = document.getElementById("TermWarn").checked;

	// process mode args
	if (TRIMODE_SIZE != "") {
		TRIMODE_SIZE = TRIMODE_SIZE.split("-");
		for (let i = 0; i < TRIMODE_SIZE.length; i++) {
			TRIMODE_SIZE[i] = parseInt(TRIMODE_SIZE[i]);
		}
	} else {
		TRIMODE_SIZE = [NSIZE, NSIZE, NSIZE];
		toDisplay += ("<b>IMPORTANT:</b> Trimode N-sizes not defined, defaulting each to " + NSIZE) + "<br>";
	}

	if (DUALMODE_SIZE != "") {
		DUALMODE_SIZE = DUALMODE_SIZE.split("-");
		for (let i = 0; i < DUALMODE_SIZE.length; i++) {
			DUALMODE_SIZE[i] = parseInt(DUALMODE_SIZE[i]);
		}
	} else {
		DUALMODE_SIZE = [NSIZE, NSIZE];
		toDisplay += ("<b>IMPORTANT:</b> Dual mode N-sizes not defined, defaulting each to " + NSIZE) + "<br>";
	}

	if (CLIENT != "")
		CLIENT = CLIENT.toLowerCase();
	WARNINGS.push(toDisplay);
	if (WARNINGS.length > 0)
		DisplayWarnings();
}

function DisplayWarnings() {
	let message = "";
	for (let i = 0; i < WARNINGS.length; i++) {
		message += WARNINGS[i] + "<br>";
	}
	document.getElementById("WarningBuffer").innerHTML = message;
	alert("Warnings present. See Report.");
}
