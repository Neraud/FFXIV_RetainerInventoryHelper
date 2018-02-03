#!/usr/bin/env python3

import urllib.request, json 

with urllib.request.urlopen("http://api.xivdb.com/data/armoire") as url:
    items = json.loads(url.read().decode())
    
    print("id", sep = "\t")
    
    for i, item in items.items():
        print(item["item"], sep = "\t")
