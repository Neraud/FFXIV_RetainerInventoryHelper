#!/usr/bin/env python3

import urllib.request, json
import codecs

quantity = {}
ventures = {}

req = urllib.request.Request("https://xivapi.com/RetainerTaskNormal?columns=ID,ItemTargetID,Quantity2&max_items=1000", headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as url:
    response = json.loads(url.read().decode())
    for result in response["Results"]:
        if result['ItemTargetID'] != None and result['Quantity2'] != None and int(result['Quantity2']) > 0:
            quantity[result['ID']] = { 'itemId': result['ItemTargetID'], 'qty': result['Quantity2'] }


req = urllib.request.Request("https://xivapi.com/RetainerTask?columns=ID,IsRandom,Task,ClassJobCategoryTargetID,RetainerLevel&max_items=1000", headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as url:
    response = json.loads(url.read().decode())
    for result in response["Results"]:
        ventureId = result['ID']
        isRandom = result['IsRandom']
        taskId = result['Task']    
        if isRandom != None and int(isRandom) == 0 and taskId != None and int(taskId) > 0:
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

print("taskId", "retainerJob", "retainerLevel", "itemId", "qty", sep = "\t")
for taskId, venture in ventures.items():
    print(venture["taskId"], venture["classJobCategory"], venture["retainerLevel"], venture["itemId"], venture["qty"], sep = "\t")
