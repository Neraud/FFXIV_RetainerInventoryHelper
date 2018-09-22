#!/usr/bin/env python3

import urllib.request, json

req = urllib.request.Request("https://xivapi.com/Cabinet?columns=Item.ID&max_items=1000", headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as url:
    response = json.loads(url.read().decode())
    print("id", sep = "\t")
    
    for result in response["Results"]:
        item = result['Item']
        if item and result['Item']['ID']:
            print(result['Item']['ID'], sep = "\t")
