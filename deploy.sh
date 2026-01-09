#!/bin/bash

set -e

# Load environment variables
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

if [ -z "$SERVER" ] || [ -z "$SERVER_PATH" ]; then
  echo "Error: SERVER and SERVER_PATH must be set in .env"
  exit 1
fi

echo "Building..."
npm run build

echo "Deploying to $SERVER:$SERVER_PATH"
rsync -avz --delete --exclude='maps' dist/ "$SERVER:$SERVER_PATH/"
rsync -avz --delete maps/ "$SERVER:$SERVER_PATH/maps/"

echo "Done!"
