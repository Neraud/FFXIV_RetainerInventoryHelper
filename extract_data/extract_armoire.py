#!/usr/bin/env python3

import urllib.request, json

req = urllib.request.Request("http://api.xivdb.com/data/armoire", headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as url:
    items = json.loads(url.read().decode())
    
    print("id", sep = "\t")
    
    for i, item in items.items():
        print(item["item"], sep = "\t")
