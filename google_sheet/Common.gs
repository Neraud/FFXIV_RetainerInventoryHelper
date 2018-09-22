var ss = SpreadsheetApp.getActiveSpreadsheet();
var settingsSheet = ss.getSheetByName('Settings');
var itemInfoByName = new Object();

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

function extractSettingsVentures() {
	var ventureSettings = new Object();
	ventureSettings["HUNT"] = new Object();
	ventureSettings["HUNT"]["maxLevel"] = settingsSheet.getRange(5, 2).getValue();
	ventureSettings["HUNT"]["minQuantity"] = settingsSheet.getRange(5, 3).getValue();
	
	ventureSettings["MIN"] = new Object();
	ventureSettings["MIN"]["maxLevel"] = settingsSheet.getRange(6, 2).getValue();
	ventureSettings["MIN"]["minQuantity"] = settingsSheet.getRange(6, 3).getValue();
	
	ventureSettings["BTN"] = new Object();
	ventureSettings["BTN"]["maxLevel"] = settingsSheet.getRange(7, 2).getValue();
	ventureSettings["BTN"]["minQuantity"] = settingsSheet.getRange(7, 3).getValue();
	
	ventureSettings["FSH"] = new Object();
	ventureSettings["FSH"]["maxLevel"] = settingsSheet.getRange(8, 2).getValue();
	ventureSettings["FSH"]["minQuantity"] = settingsSheet.getRange(8, 3).getValue();
	
	return ventureSettings;
}

function initItemInfo() {
	var itemsSheet = ss.getSheetByName('Item List');
	var itemsData = itemsSheet.getDataRange().getValues();
	
	// Skip header
	for (var i = 1; i < itemsData.length; i++) {
		// id	is_unique	stack_size	name_en	name_de	name_fr	name_ja
		var xivapiId = itemsData[i][0];
		var unique = (itemsData[i][1] != 0);
		var stackSize = itemsData[i][2];
		
		var langague = extractSettingLanguage();
		var nameIndex;
		if(langague == "de") nameIndex = 4;
		else if(langague == "fr") nameIndex = 5;
		else if(langague == "ja") nameIndex = 6;
		else nameIndex = 3;
		
		var name = itemsData[i][nameIndex];
		
		itemInfoByName[name] = {"xivapiId": xivapiId, "unique": unique, "stackSize": stackSize, "name": name};
	}
}

function getItemInfoByName(name) {
	var info = itemInfoByName[name];
	
	if(info == undefined) {
		Logger.log("Missing xivapi info for " + name);
	}
	
	return info;
}

function analyseAll() {
	analyseStacks();
	analyseArmoire();
	analyseVenture();
}
