#!/bin/bash

# Temporary directory for cloning
TEMP_DIR="temp_clone"

# Remote repository URL (Replace 'username' with the actual username or organization)
REMOTE_REPO="https://github.com/gndclouds/db.git"

# Clone the remote repository into a temporary directory
# Use the environment variable for the token
git clone https://${GITHUB_TOKEN}@${REMOTE_REPO#https://} $TEMP_DIR

# Copy the 'content' directory from the cloned repo to the local 'content' directory
cp -r $TEMP_DIR/content/* content/

# Copy the 'public' directory from the cloned repo to the local 'public' directory
cp -r $TEMP_DIR/public/* public/

# Remove the temporary directory
rm -rf $TEMP_DIR

echo "Folders 'content' and 'public' have been updated from the remote repository."