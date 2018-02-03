#!/usr/bin/env python3

import urllib.request, json 

with urllib.request.urlopen("https://api.xivdb.com/item?columns=id,lodestone_id,is_unique,stack_size,name_en,name_de,name_fr,name_ja") as url:
    items = json.loads(url.read().decode())
    
    print("id", "lodestone_id", "is_unique", "stack_size", "name_en", "name_de", "name_fr", "name_ja", sep = "\t")
    
    for item in items:
        print(item["id"], item["lodestone_id"], item["is_unique"], item["stack_size"], item["name_en"], item["name_de"], item["name_fr"], item["name_ja"], sep = "\t")
