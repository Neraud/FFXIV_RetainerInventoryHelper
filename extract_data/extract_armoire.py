#!/usr/bin/env python3

import urllib.request, json

maxItemsPerCall=1000

def extractForPage(page):
    url = f'https://xivapi.com/Cabinet?columns=Item.ID&max_items={maxItemsPerCall}&page={page}'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as url:
        response = json.loads(url.read().decode())
        pagination = response['Pagination']
        print("id", sep = "\t")
        
        for result in response["Results"]:
            item = result['Item']
            if item and result['Item']['ID']:
                print(result['Item']['ID'], sep = "\t")
        return pagination['PageNext']

pageNext = 1
while pageNext:
    pageNext = extractForPage(pageNext)
