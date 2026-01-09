#!/bin/bash

set -e

if [ $# -ne 2 ]; then
  echo "Usage: $0 \"Map Name\" /path/to/image.png"
  exit 1
fi

NAME="$1"
SOURCE="$2"
MAPS_DIR="$(dirname "$0")/maps"
JSON_FILE="$(dirname "$0")/src/maps.json"

# Check source file exists
if [ ! -f "$SOURCE" ]; then
  echo "Error: Source file '$SOURCE' not found"
  exit 1
fi

# Replace spaces with underscores for filename
FILENAME=$(echo "$NAME" | sed 's/ /_/g')
JPG_FILE="$MAPS_DIR/${FILENAME}.jpg"
MIN_FILE="$MAPS_DIR/${FILENAME}.min.jpg"

# Check if map already exists
if [ -f "$JPG_FILE" ]; then
  echo "Error: Map '$JPG_FILE' already exists"
  exit 1
fi

echo "Converting to JPG (85% quality)..."
ffmpeg -i "$SOURCE" -q:v 2 "$JPG_FILE" -y 2>/dev/null

echo "Creating thumbnail (300px for 2x retina)..."
ffmpeg -i "$JPG_FILE" -vf "scale=300:-1" -q:v 2 "$MIN_FILE" -y 2>/dev/null

echo "Updating maps.json..."
# Create new entry and merge with existing JSON, then sort by name
node -e "
const fs = require('fs');
const maps = JSON.parse(fs.readFileSync('$JSON_FILE', 'utf8'));
maps.push({ name: '$NAME', path: '${FILENAME}.jpg' });
maps.sort((a, b) => a.name.localeCompare(b.name));
fs.writeFileSync('$JSON_FILE', JSON.stringify(maps, null, 2) + '\n');
"

echo "Done! Added '$NAME' as ${FILENAME}.jpg"
echo "  Full: $(du -h "$JPG_FILE" | cut -f1)"
echo "  Thumb: $(du -h "$MIN_FILE" | cut -f1)"
