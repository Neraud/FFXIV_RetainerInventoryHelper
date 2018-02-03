var armoireResultSheet = ss.getSheetByName('Armoire');
var armoireByXivdbId = new Object();

function initArmoire() {
	var armoireSheet = ss.getSheetByName('Armoire List');
	var armoireData = armoireSheet.getDataRange().getValues();
	
	// Skip header
	for (var i = 1; i < armoireData.length; i++) {
		// id
		var xivdbId = armoireData[i][0];
	
		armoireByXivdbId[xivdbId] = true;
	}
}

function resetArmoireResults() {
	armoireResultSheet.clear();
	armoireResultSheet.appendRow(["Item", "Retainer"]);
}

function writeArmoire(retainerName, itemInfo) {
	armoireResultSheet.appendRow([itemInfo["name"], retainerName]);
}

function analyseArmoire() {
	ss.toast("Starting armoire analysis");
	
	var inventoriesSheet = ss.getSheetByName('Raw inventories')
	var inventoriesData = inventoriesSheet.getDataRange().getValues();
	resetArmoireResults();
	initItemInfo();
	initArmoire();
	
	var armoireItems = [];
	
	for (var i = 0; i < inventoriesData.length; i++) {
		var retainerName = inventoriesData[i][0];
		var lodestoneId = inventoriesData[i][1];
		
		var itemInfo = getItemInfoByLodestoneId(lodestoneId);
		if(itemInfo != undefined) {
			var itemArmoire = armoireByXivdbId[itemInfo["xivdbId"]];
			if(itemArmoire) {
				writeArmoire(retainerName, itemInfo);
			}
		}
	}
	
	ss.toast("Finished armoire analysis");
}
