
# FFXIV Retainer Inventory Helper

This project is a tool to help you manage the inventories of your retainer(s) more easily.

## What can it do for you ?

This project is meant to 
 - list items that could be stacked to save precious inventory slots
 - list non-unique items for which you have stacks on various retainers
 - list items that can be added in the Armoire
 - assit you in selecting your next rounds of retainer ventures 

All these results are available in a Google Spreadsheet, that you can filter / sort as you wish.

Well, let's look at examples to illustrate these features

### Item stacks

![Item Stacks](/docs/example_report_stacks.png)

Here, I can save a slot by combining my 2 stacks of SavageMight Materia V.
Also, I can see that I have Effervescent Water on 2 different retainers. I can save a slot, but I might want to have them both in the same retainer.

### Armoire

![Item Stacks](/docs/example_report_armoire.png)

Here, I can save 2 slots by removing these items from my retainer and storing them in the Armoire.

### Venture planning

I usually want to keep crafting components available on my retainers when they are not dirt cheap on the market board. 
And as I'm lazy, I send my retainers on ventures to keep this supply steady.

This feature let you set up an amount of materials you want available.
It scans through your retainers' inventories for items that can be obtained via Ventures, and assumes that for all these items, you want to maintain your minimum supply.

![Item Stacks](/docs/example_report_ventures.png)


## How does it work ?

This project is basicaly composed of 2 parts : 
 - a userscript, that captures your retainers' inventories from your Lodestone profile
 - a Google SpreadSheet with a couple of scripts that analyses the data and presents the results


## Getting Started

### Prerequisites

The scanner part is a [Userscript](https://github.com/OpenUserJs/OpenUserJS.org/wiki/Userscript-beginners-HOWTO).

Please look at this [guide](https://github.com/OpenUserJs/OpenUserJS.org/wiki/Userscript-beginners-HOWTO#how-do-i-get-going) to enable Userscript support on your favorite browser.

### Installing the scanner

To install the scanner, simply click this [link](https://raw.github.com/neraud/FFXIV_RetainerInventoryHelper/master/inventory_scanner/ffxiv_retainer_inventory_scanner.user.js).
If your browser has Userscript support, it should ask you if you want to install it.
Accept it, and your scanner is good to go !

### Preparing the Google SpreadSheet

As you want to add your own data in there, you need to use your own copy of the SpreadSheet.
Please open the [original one](https://drive.google.com/open?id=1jxjx9Cea4a9G-Vb9l4BhonjbWX-rGVKzOwS04e1da_U), and use File > Make a copy.

When the copy is done, you can use it.

Go to the Settings tab.
You can tweak them if you want.

Click on the large "Analyze All" button.
As you haven't imported your retainers' inventories yet, it shouldn't do anything.
However, if you've just copied the Spreadsheet, it should prompt you to allo the script to read your data. Accept it. 

### Scanning your retainers

In the browser where you have installed the scanner
 - Log in on the [lodestone](https://na.finalfantasyxiv.com/lodestone/)
 - Navigate to your profile
 - Select the Retainers tab 

The scanner should inject a new "Scan all retainers" button on this page.
TODO

### Analysing your inventory

TODO

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

Thank you to : 
* [viion](https://github.com/viion), developer of XIVAPI.com, where the Item Armoire and Venture data comes from 
* [Nivomi](https://www.reddit.com/user/Nivomi) who gave me the idea with his [own tool](https://terribleideas.org/retainermaintainer/) (cf his [reddit post](https://www.reddit.com/r/ffxiv/comments/7unmde/introducing_retainer_maintainer_alpha_a_tool_to/))

