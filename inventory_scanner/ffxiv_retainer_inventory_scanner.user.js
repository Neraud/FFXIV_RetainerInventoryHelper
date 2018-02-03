// ==UserScript==
// @name            FFXIV Retainer Inventory Scanner
// @description     This UserScript scans the retainers' inventories and extract their content
//
// @author          Neraud
// @namespace       https://github.com/neraud
// @downloadURL     https://raw.github.com/neraud/FFXIV_RetainerInventoryHelper/master/inventory_scanner/ffxiv_retainer_inventory_scanner.user.js
// @updateURL       https://raw.github.com/neraud/FFXIV_RetainerInventoryHelper/master/inventory_scanner/ffxiv_retainer_inventory_scanner.user.js
//
// @include         https://*.finalfantasyxiv.com/lodestone/character/*/retainer/*
// @include         https://*.finalfantasyxiv.com/lodestone/character/*/retainer/*/
//
// @require         https://code.jquery.com/jquery-3.3.1.min.js
//
// @grant           GM.setClipboard
//
// @version         0.9.0
//
// ==/UserScript==

var retainerInventories = [];

function refreshAllRetainers(event) {
	console.log("[ffxiv_retainer_inventory_scanner] RefreshAllRetainers starting");
	event.preventDefault();
	
	var retainerRefreshPromises = [];
	
	$(".retainer__data ul.parts__switch li a.parts__switch__link").each(function(i, retainerA) {
		var retainerName = retainerA.text;
		var retainerUrl = retainerA.href;
		
		console.log("[ffxiv_retainer_inventory_scanner] - " + retainerName);
		
		var retainerInventoryUrl;
		if(retainerUrl.endsWith("/venture/")) {
			retainerInventoryUrl = retainerUrl.replace("/venture/", "/baggage/");
		} else if(retainerUrl.endsWith("/baggage/")) {
			retainerInventoryUrl = retainerUrl;
		} else if(retainerUrl.endsWith("/")) {
			retainerInventoryUrl = retainerUrl + "baggage/";
		} else {
			retainerInventoryUrl = retainerUrl + "/baggage/";
		}
		
		console.log("[ffxiv_retainer_inventory_scanner]  -> " + retainerInventoryUrl);
		var jqxhr = $.get(retainerInventoryUrl).done(content => {
			refreshOneRetainerData(retainerName, content);
		})
		.fail(jqXhr => {
			console.log("[ffxiv_retainer_inventory_scanner] Error for " + retainerName + " : " + jqXhr.status + ", statusText : " + jqXhr.statusText);
		});
		
		retainerRefreshPromises.push(jqxhr);
  	});
  
	$.when.apply($, retainerRefreshPromises).then(allRetainersUpdated);
  
	console.log("[ffxiv_retainer_inventory_scanner] RefreshAllRetainers finished"); 
}

function refreshOneRetainerData(retainerName, content) {
	console.log("[ffxiv_retainer_inventory_scanner] Parsing result for " + retainerName);
	
	var retainerHtml = $.parseHTML(content);
	$(retainerHtml).find("ul.item-list--footer li.item-list__list").each(function(i, item) {
		var itemQty = $(item).data("stack");
		var itemDbUrl = $(item).find("div.db-tooltip__bt_item_detail:first a").attr("href");
		var itemId = itemDbUrl.replace(/\/(\?.*)?$/, "").replace(/.*\//, "");
		var itemName = $(item).find("h2.db-tooltip__item__name:first").text();
		var hq = ($(item).find(".ic_item_quality").length > 0)
		
		retainerInventories.push({
			"retainerName": retainerName,
			"itemId": itemId,
			"hq": hq,
			"itemQty": itemQty
		});
	});
}

function allRetainersUpdated() {
	console.log("[ffxiv_retainer_inventory_scanner] AllRetainersUpdated");
	var retainerInventoriesString = "";
  
	var stats = new Object();
	var retainerCount = 0;
	var itemStackCount = 0;
	
	$.each(retainerInventories, function(i, item) {
		if(stats[item["retainerName"]] == undefined) {
			stats[item["retainerName"]] = 1;
			retainerCount++;
		} else {
			stats[item["retainerName"]]++;
		}
		itemStackCount++;
		
		retainerInventoriesString = retainerInventoriesString + item["retainerName"] + "\t" + item["itemId"] + "\t" + item["hq"] + "\t" + item["itemQty"] + "\n";
	});
	
	var statMessage = retainerCount + " retainers have been scan for a total of " + itemStackCount;
	
	for(var retainerName in stats) {
		statMessage += "\n - " + retainerName + " : " + stats[retainerName] + " items";
	}
	
	statMessage += "\n\nThe whole inventory data has been saved to your clipboard. You can paste it in Google Drive now !";
	
	GM.setClipboard(retainerInventoriesString);
	alert(statMessage);
}

/**
 * SCRIPT DESCRIPTION.
 *
 * @see http://wiki.greasespot.net/API_reference
 * @see http://wiki.greasespot.net/Metadata_Block
 */
(function() {	
	console.log("[ffxiv_retainer_inventory_scanner] Starting");
	
	var refreshUl = $("<ul/>").attr("class", "btn__menu-3")
	var refreshLi = $("<li/>");
	var refreshLink = $("<a/>").attr("class", "btn__menu btn__menu--active").attr("href", "#").html("Scan all retainers");
	refreshLink.click(refreshAllRetainers);
	refreshUl.append(refreshLi);
	refreshLi.append(refreshLink);
	$(".ldst__window:first").prepend(refreshUl);  
	
	console.log("[ffxiv_retainer_inventory_scanner] Finished");
})();