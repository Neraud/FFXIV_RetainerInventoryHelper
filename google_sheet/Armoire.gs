var armoireResultSheet = ss.getSheetByName('Armoire');
var armoireByXivapiId = new Object();

function initArmoire() {
	var armoireSheet = ss.getSheetByName('Armoire List');
	var armoireData = armoireSheet.getDataRange().getValues();
	
	// Skip header
	for (var i = 1; i < armoireData.length; i++) {
		// id
		var xivapiId = armoireData[i][0];
	
		armoireByXivapiId[xivapiId] = true;
	}
}

function resetArmoireResults() {
	resetFilters(armoireResultSheet);
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
		var itemName = inventoriesData[i][1];
		
		var itemInfo = getItemInfoByName(itemName);
		if(itemInfo != undefined) {
			var itemArmoire = armoireByXivapiId[itemInfo["xivapiId"]];
			if(itemArmoire) {
				writeArmoire(retainerName, itemInfo);
			}
		}
	}
	
	ss.toast("Finished armoire analysis");
}
