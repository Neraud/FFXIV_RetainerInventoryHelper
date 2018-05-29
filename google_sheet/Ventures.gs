var ventureResultSheet = ss.getSheetByName('Ventures');
var ventureByXivdbId = new Object();
var ventureSettings = extractSettingsVentures();

function isAnalyseVentureEnabled() {
	return (
		(ventureSettings["HUNT"]["maxLevel"] > 0 && ventureSettings["HUNT"]["minQuantity"] > 0)
		||
		(ventureSettings["MIN"]["maxLevel"] > 0 && ventureSettings["MIN"]["minQuantity"] > 0)
		||
		(ventureSettings["BTN"]["maxLevel"] > 0 && ventureSettings["BTN"]["minQuantity"] > 0)
		||
		(ventureSettings["FSH"]["maxLevel"] > 0 && ventureSettings["FSH"]["minQuantity"] > 0)
	)
}

function initVentures() {
	var ventureSheet = ss.getSheetByName('Venture List');
	var ventureData = ventureSheet.getDataRange().getValues();
	
	// Skip header
	for (var i = 1; i < ventureData.length; i++) {
		// taskId	retainerJob	retainerLevel	itemId	qty
		var xivdbId = ventureData[i][3];
		var retainerJob = ventureData[i][1];
		var retainerLevel = ventureData[i][2];
		var qty = ventureData[i][4];
		
		ventureByXivdbId[xivdbId] = { "retainerJob": retainerJob, "retainerLevel": retainerLevel, "qty": qty};
	}
}

function resetVentureResults() {
	resetFilters(ventureResultSheet);
	ventureResultSheet.clear();
	ventureResultSheet.appendRow(["Item", "Retainer Job", "Retainer Level", "Qty", "Missing qty", "Missing Ventures"]);
}

function writeMissingVenture(ventureItem) {
	/*
	Logger.log("==================================================");
	Logger.log("Venture detected");
	Logger.log(ventureItem);
	*/
	
	var itemInfo = ventureItem["itemInfo"];
	var ventureInfo = ventureItem["ventureInfo"];
	var qty = ventureItem["qty"];
	var ventureMin = ventureSettings[ventureInfo["retainerJob"]]["minQuantity"];
	var missingQty = ventureMin - qty;
	var missingVentures = Math.ceil(missingQty / ventureInfo["qty"]);
	ventureResultSheet.appendRow([itemInfo["name"], ventureInfo["retainerJob"], ventureInfo["retainerLevel"], qty, missingQty, missingVentures]);
}

function analyseVenture() {
	if(isAnalyseVentureEnabled()) {
		ss.toast("Starting venture analysis");
		var inventoriesSheet = ss.getSheetByName('Raw inventories')
		var inventoriesData = inventoriesSheet.getDataRange().getValues();
		resetVentureResults();
		initItemInfo();
		initVentures();
		
		var ventureItems = new Object();
		
		for (var i = 0; i < inventoriesData.length; i++) {
			var lodestoneId = inventoriesData[i][1];
			//var hq = inventoriesData[i][2];
			var qty = inventoriesData[i][3];
			
			var itemInfo = getItemInfoByLodestoneId(lodestoneId);
			if(itemInfo != undefined) {
				var ventureInfo = ventureByXivdbId[itemInfo["xivdbId"]];
				if(ventureInfo) {
					// It is indeed a venture, check quantity
					if(ventureItems[lodestoneId] == undefined) ventureItems[lodestoneId] = { "itemInfo": itemInfo, "ventureInfo": ventureInfo, "qty": 0};
					
					ventureItems[lodestoneId]["qty"] += qty;
				}
			}
		}
		
		for(lodestoneId in ventureItems) {
			var ventureItem = ventureItems[lodestoneId];
			if(ventureItem["qty"] < ventureMin) {
				writeMissingVenture(ventureItem);
			}
		}
		
		ss.toast("Finished venture analysis");
	} else {
		ss.toast("No venture Min set up, nothing to do"); 
	}
}
