#!/bin/bash

# This script tests if your GitHub credentials work correctly

# Check if username and token are provided
if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: ./test-git-auth.sh <github_username> <github_token>"
  exit 1
fi

username=$1
token=$2

# Create a temporary directory
temp_dir=$(mktemp -d)
cd $temp_dir

# Set up Git credentials
git config --global credential.helper store
echo "https://${username}:${token}@github.com" > ~/.git-credentials
chmod 600 ~/.git-credentials

# Try to clone the repository
echo "Testing authentication by cloning repository..."
git clone https://github.com/gndclouds/db.git

# Check if clone was successful
if [ $? -eq 0 ]; then
  echo "SUCCESS: Authentication works correctly!"
  ls -la db
else
  echo "ERROR: Authentication failed. Please check your username and token."
fi

# Clean up
rm -rf $temp_dir
rm -f ~/.git-credentials
git config --global --unset credential.helper

exit 0 