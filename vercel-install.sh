#!/bin/bash

# Enable verbose output for debugging
set -x

# Define variables for new URL components
username=$GIT_USERNAME
token=$GIT_ACCESS_TOKEN

# Check if credentials are available
if [ -z "$username" ] || [ -z "$token" ]; then
  echo "ERROR: Git credentials are missing. Please set GIT_USERNAME and GIT_ACCESS_TOKEN environment variables."
  # Create empty directories to prevent build failures
  mkdir -p src/app/db/content/newsletters
  exit 1
fi

# Print current directory for debugging
echo "Current directory: $(pwd)"

# Remove existing submodule directory if it exists
if [ -d "src/app/db" ]; then
  echo "Removing existing directory: src/app/db"
  rm -rf src/app/db
fi

# Create parent directories if they don't exist
mkdir -p $(dirname src/app/db)

# Set up Git credentials using the proper method
git config --global credential.helper store
echo "https://${username}:${token}@github.com" > ~/.git-credentials
chmod 600 ~/.git-credentials

# Clone the repository using HTTPS without embedding credentials in the URL
echo "Cloning repository: https://github.com/gndclouds/db.git"
git clone https://github.com/gndclouds/db.git src/app/db

# Check if clone was successful
if [ $? -ne 0 ]; then
  echo "ERROR: Failed to clone repository"
  # Create empty directories to prevent build failures
  mkdir -p src/app/db/content/newsletters
  exit 1
fi

# Verify the content directory exists
if [ -d "src/app/db/content" ]; then
  echo "Content directory exists: src/app/db/content"
  ls -la src/app/db/content
else
  echo "WARNING: Content directory does not exist, creating it"
  mkdir -p src/app/db/content/newsletters
fi

# Clean up credentials
rm -f ~/.git-credentials
git config --global --unset credential.helper

echo "Repository setup completed successfully"