var stackResultSheet = ss.getSheetByName('Stacks & spread');

function resetDupeStacksResults() {
	resetFilters(stackResultSheet);
	stackResultSheet.clear();
	stackResultSheet.appendRow(["Item", "Type", "Stacks", "Saved slots"]);
}

function itemStacksToString(itemStacks) {
	var string = "";
	for (var i = 0; i < itemStacks.length; i++) {
		if(i > 0) string += ", ";
		string += itemStacks[i]["retainerName"] + ":" + itemStacks[i]["qty"]
	}
	return string;
}

function writeDupe(item, itemInfo, expectedStackCount) {
	var itemStacks = item["stacks"];
	var stackCount = itemStacks.length;
	var slotSaved = stackCount - expectedStackCount;
	/*
	Logger.log("==================================================");
	Logger.log("Dupe detected, you can save " + slotSaved + " slot(s)");
	Logger.log(item);
	Logger.log(itemInfo);
	*/
	stackResultSheet.appendRow([itemInfo["name"], "Dupe", itemStacksToString(itemStacks), slotSaved]);
}

function writeSpread(item, itemInfo) {
	var itemStacks = item["stacks"];
	/*
	Logger.log("==================================================");
	Logger.log("Spread detected");
	Logger.log(item);
	Logger.log(itemInfo);
	*/
	stackResultSheet.appendRow([itemInfo["name"], "Spread", itemStacksToString(itemStacks), 0]);
}

function analyseStacks() {
	ss.toast("Starting stack analysis");
	var inventoriesSheet = ss.getSheetByName('Raw inventories')
	var inventoriesData = inventoriesSheet.getDataRange().getValues();
	resetDupeStacksResults();
	initItemInfo();
	
	var items = new Object();
	// key : unique itemId, built using 'itemName - hq'
	// value : array of stacks
	
	for (var i = 0; i < inventoriesData.length; i++) {
		var retainerName = inventoriesData[i][0];
		var itemName = inventoriesData[i][1];
		var hq = inventoriesData[i][2];
		var qty = inventoriesData[i][3];
		
		var itemId = itemName + " - " + hq;
		
		if(items[itemId] == undefined) {
			items[itemId] = { "itemName": itemName, "hq": hq, "stacks": []};
		}
		items[itemId]["stacks"].push({"retainerName": retainerName, "qty": qty});
	}
	
	for(itemId in items) {
		var item = items[itemId];
		var itemStacks = item["stacks"];
		var stackCount = itemStacks.length;
		
		if(stackCount > 1) {
			var itemName = item["itemName"];
			// We know we have multiple stacks, we need item info
			var itemInfo = getItemInfoByName(itemName);
			
			if(itemInfo != undefined) {
				if(!itemInfo['unique']) {
					// Not unique, we need to look at the stack size
					var stackSize = itemInfo["stackSize"];
					var totalQty = 0;
					for (var i = 0; i < itemStacks.length; i++) totalQty += itemStacks[i]["qty"];
					
					var expectedStackCount = Math.ceil(totalQty / stackSize);
					
					if(stackCount > expectedStackCount) {
						writeDupe(item, itemInfo, expectedStackCount);
					} else {
						// No Dupe, but we can still check if we have stacks spread on multiple retainers
						var retainerNames = [];
						for (var i = 0; i < itemStacks.length; i++) {
							var retainerName = itemStacks[i]["retainerName"];
							if(retainerNames.indexOf(retainerName) == -1) retainerNames.push(retainerName);
						}
						
						if(retainerNames.length > 1) {
							writeSpread(item, itemInfo);
						}
					}
				}
			}
		}
	}
	ss.toast("Finished stack analysis");
}
