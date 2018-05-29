#!/usr/bin/env python3

import urllib.request, csv, io
import codecs

quantity = {}
ventures = {}

with urllib.request.urlopen("https://raw.githubusercontent.com/viion/ffxiv-datamining/master/csv/RetainerTaskNormal.csv") as url:
    csvContent = url.read().decode()
    csvLines = csvContent.splitlines()[4:]
    
    reader = csv.reader(csvLines, delimiter=',')
        
    # #,Item,Quantity[0],Quantity[1],Quantity[2],,
    for row in reader:
        taskId = row[0]
        itemId = row[1]
        qty = row[4]
        quantity[taskId] = { 'itemId': itemId, 'qty': qty }

with urllib.request.urlopen("https://raw.githubusercontent.com/viion/ffxiv-datamining/master/csv/RetainerTask.csv") as url:
    csvContent = url.read().decode()
    csvLines = csvContent.splitlines()[4:]
    
    reader = csv.reader(csvLines, delimiter=',')
        
    # #,IsRandom,ClassJobCategory,RetainerLevel,,RetainerTaskParameter,VentureCost,MaxTime{min},Experience,RequiredItemLevel,,,RequiredGathering,,Task
    for row in reader:
        ventureId = row[0]
        isRandom = row[1]
        taskId = row[14]     
        if isRandom == 'False' and int(taskId) > 0:    
            classJobCategoryId = int(row[2])
            
            if classJobCategoryId == 17: classJobCategory = "MIN"
            elif classJobCategoryId == 18: classJobCategory = "BTN"
            elif classJobCategoryId == 19: classJobCategory = "FSH"
            elif classJobCategoryId == 34: classJobCategory = "HUNT"
            else: classJobCategory = "UKN"
            
            retainerLevel = row[3]
            
            if taskId in quantity:
                itemId = quantity[taskId]['itemId']
                qty = quantity[taskId]['qty']
            else:
                itemId = -1
                qty = -1
            
            ventures[taskId] = { 'taskId': taskId, 'ventureId': ventureId, 'classJobCategory': classJobCategory, 'retainerLevel': retainerLevel, 'itemId': itemId, 'qty': qty }

print("taskId", "retainerJob", "retainerLevel", "itemId", "qty", sep = "\t")
for taskId, venture in ventures.items():
    print(venture["taskId"], venture["classJobCategory"], venture["retainerLevel"], venture["itemId"], venture["qty"], sep = "\t")