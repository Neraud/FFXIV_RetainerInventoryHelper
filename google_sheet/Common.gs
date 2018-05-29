var ss = SpreadsheetApp.getActiveSpreadsheet();
var settingsSheet = ss.getSheetByName('Settings');
var itemInfoByLodestoneId = new Object();

function resetFilters(sheet) {
	var ssId = ss.getId();
	var sheetId = sheet.getSheetId();
		
	var requests = [{
		"clearBasicFilter": {
			"sheetId": sheetId
		}
	}, 
	{
		"setBasicFilter": {
			"filter": {"range": { "sheetId": sheetId }}
		}
	}];
	Sheets.Spreadsheets.batchUpdate({'requests': requests}, ssId);
}

function extractSettingLanguage() {
	return settingsSheet.getRange(1, 2).getValue();
}

function extractSettingVentureMin() {
	return settingsSheet.getRange(2, 2).getValue();
}

function initItemInfo() {
	var itemsSheet = ss.getSheetByName('Item List');
	var itemsData = itemsSheet.getDataRange().getValues();
	
	// Skip header
	for (var i = 1; i < itemsData.length; i++) {
		// id	lodestone_id	is_unique	stack_size	name_en	name_de	name_fr	name_ja
		var xivdbId = itemsData[i][0];
		var lodestoneId = itemsData[i][1];
		var unique = (itemsData[i][2] != 0);
		var stackSize = itemsData[i][3];
		
		var langague = extractSettingLanguage();
		var nameIndex;
		if(langague == "de") nameIndex = 5;
		else if(langague == "fr") nameIndex = 6;
		else if(langague == "ja") nameIndex = 7;
		else nameIndex = 4;
		
		var name = itemsData[i][nameIndex];
		
		itemInfoByLodestoneId[lodestoneId] = {"xivdbId": xivdbId, "unique": unique, "stackSize": stackSize, "name": name};
	}
}

function getItemInfoByLodestoneId(lodestoneId) {
	var info = itemInfoByLodestoneId[lodestoneId];
	
	if(info == undefined) {
		Logger.log("Missing xivdb info for " + lodestoneId);
	}
	
	return info;
}

function analyseAll() {
	analyseStacks();
	analyseArmoire();
	analyseVenture();
}
