#!/usr/bin/env bash

EXTRACTION_ROOT_PATH=$(dirname "$(readlink -f ${BASH_SOURCE[0]})")

echo "Extracting item information"
${EXTRACTION_ROOT_PATH}/extract_items.py > ${EXTRACTION_ROOT_PATH}/items.txt 
echo "Items extracted : $(wc -l ${EXTRACTION_ROOT_PATH}/items.txt) items"
echo ""

echo "Extraction the armoire items"
${EXTRACTION_ROOT_PATH}/extract_armoire.py > ${EXTRACTION_ROOT_PATH}/armoire.txt 
echo "Armoire extracted : $(wc -l ${EXTRACTION_ROOT_PATH}/armoire.txt) items"
echo ""

echo "Extraction the ventures"
${EXTRACTION_ROOT_PATH}/extract_ventures.py > ${EXTRACTION_ROOT_PATH}/ventures.txt 
echo "Ventures extracted : $(wc -l ${EXTRACTION_ROOT_PATH}/ventures.txt) ventures"
echo ""
