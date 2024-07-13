#!/usr/bin/env python3

import urllib.request, json
import codecs

maxItemsPerCall=1000

quantity = {}
ventures = {}


def extractQuantityForPage(page):
    url = f'https://xivapi.com/RetainerTaskNormal?columns=ID,ItemTargetID,Quantity2&max_items={maxItemsPerCall}&page={page}'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as url:
        response = json.loads(url.read().decode())
        pagination = response['Pagination']
        for result in response["Results"]:
            if result['ItemTargetID'] != None and result['Quantity2'] != None and int(result['Quantity2']) > 0:
                quantity[result['ID']] = { 'itemId': result['ItemTargetID'], 'qty': result['Quantity2'] }
    
        return pagination['PageNext']

def extractVentureForPage(page):
    url = f'https://xivapi.com/RetainerTask?columns=ID,IsRandom,Task,ClassJobCategoryTargetID,RetainerLevel&max_items={maxItemsPerCall}&page={page}'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as url:
        response = json.loads(url.read().decode())
        pagination = response['Pagination']
        for result in response["Results"]:
            ventureId = result['ID']
            isRandom = result['IsRandom']
            task = result['Task']
            
            if isRandom != None and int(isRandom) == 0 and task != None:
                taskId = task['ID']
                if result['ClassJobCategoryTargetID']:  
                    classJobCategoryId = int(result['ClassJobCategoryTargetID'])
                
                    if classJobCategoryId == 17: classJobCategory = "MIN"
                    elif classJobCategoryId == 18: classJobCategory = "BTN"
                    elif classJobCategoryId == 19: classJobCategory = "FSH"
                    elif classJobCategoryId == 34: classJobCategory = "HUNT"
                    else: classJobCategory = "UKN"
                else:
                    classJobCategory = "UKN"
                    
                retainerLevel = result['RetainerLevel']
                
                if taskId in quantity:
                    itemId = quantity[taskId]['itemId']
                    qty = quantity[taskId]['qty']
                    ventures[taskId] = { 'taskId': taskId, 'ventureId': ventureId, 'classJobCategory': classJobCategory, 'retainerLevel': retainerLevel, 'itemId': itemId, 'qty': qty }
        return pagination['PageNext']

pageNext = 1
while pageNext:
    pageNext = extractQuantityForPage(pageNext)

pageNext = 1
while pageNext:
    pageNext = extractVentureForPage(pageNext)

print("taskId", "retainerJob", "retainerLevel", "itemId", "qty", sep = "\t")
for taskId, venture in ventures.items():
    print(venture["taskId"], venture["classJobCategory"], venture["retainerLevel"], venture["itemId"], venture["qty"], sep = "\t")
