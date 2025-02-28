#!/bin/bash

# This script tests the ability to clone the db repository
# It should be run locally to validate credentials and repository access

# Create a temporary directory
TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR"

echo "Testing in temporary directory: $TEMP_DIR"

# Test public access first (this would be ideal)
echo "Testing public access..."
git clone --depth=1 https://github.com/gndclouds/db.git
if [ $? -eq 0 ]; then
  echo "SUCCESS: Repository is publicly accessible!"
  rm -rf db
else
  echo "Repository requires authentication."

  # Test access with credentials if provided
  if [ -n "$GIT_USERNAME" ] && [ -n "$GIT_ACCESS_TOKEN" ]; then
    echo "Testing access with provided credentials..."
    git clone --depth=1 https://${GIT_USERNAME}:${GIT_ACCESS_TOKEN}@github.com/gndclouds/db.git
    
    if [ $? -eq 0 ]; then
      echo "SUCCESS: Authentication with provided credentials works!"
      rm -rf db
    else
      echo "ERROR: Authentication failed with provided credentials."
    fi
  else
    echo "No credentials provided. Set GIT_USERNAME and GIT_ACCESS_TOKEN to test authentication."
  fi
fi

echo "Test completed. Cleaning up..."
cd - > /dev/null
rm -rf "$TEMP_DIR"