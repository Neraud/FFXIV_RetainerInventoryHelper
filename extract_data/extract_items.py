#!/usr/bin/env python3

import urllib.request, json

maxItemsPerCall=1000

def extractForPage(page):
    url = "https://xivapi.com/Item?columns=ID,IsUnique,StackSize,Name_en,Name_de,Name_fr,Name_ja&max_items=%d&page=%d" % (maxItemsPerCall, page)
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as url:
        response = json.loads(url.read().decode())
        pagination = response['Pagination']
        
        for item in response['Results']:
            print(item["ID"], item["IsUnique"], item["StackSize"], item["Name_en"], item["Name_de"], item["Name_fr"], item["Name_ja"], sep = "\t")
        
        return pagination['PageNext']

print("id", "is_unique", "stack_size", "name_en", "name_de", "name_fr", "name_ja", sep = "\t")

page = extractForPage(1)
while page and page != 1:
    page = extractForPage(page)
