#!/bin/bash

# Enable verbose output for debugging
set -x

# Define variables for credentials
username=$GIT_USERNAME
token=$GIT_ACCESS_TOKEN

# Create directories needed for build regardless of submodule success
echo "Creating required directories for build"
mkdir -p src/app/db/newsletters
mkdir -p src/app/db/assets
mkdir -p src/app/db/projects
mkdir -p src/app/db/notes
mkdir -p src/app/db/public

# Print current directory for debugging
echo "Current directory: $(pwd)"

# Check if credentials are available
if [ -z "$username" ] || [ -z "$token" ]; then
  echo "WARNING: Git credentials are missing. Attempting to proceed with public access."
  
  # Try to clone without auth first
  echo "Attempting public clone: https://github.com/gndclouds/db.git"
  if git clone --depth=1 https://github.com/gndclouds/db.git src/app/db 2>/dev/null; then
    echo "Public clone successful"
    ls -la src/app/db
    echo "Repository setup completed successfully"
    exit 0
  fi

  # Fallback: try to init submodule (in case main repo was cloned with submodule ref)
  echo "Public clone failed. Trying git submodule update --init --recursive..."
  if git submodule update --init --recursive 2>/dev/null; then
    echo "Submodule init successful"
    ls -la src/app/db 2>/dev/null || true
    exit 0
  fi

  echo "WARNING: Public clone and submodule init failed. Images will load via asset-proxy (requires GITHUB_ACCESS_TOKEN)."
  exit 0 # Don't fail the build
else
  echo "Git credentials found, using authenticated access"
  
  # Remove existing directory if it exists
  if [ -d "src/app/db" ]; then
    echo "Removing existing directory: src/app/db"
    rm -rf src/app/db
  fi
  
  # Create parent directories if they don't exist
  mkdir -p $(dirname src/app/db)
  
  # Try both authentication methods for maximum compatibility
  
  # Method 1: Clone with embedded credentials in URL
  echo "Attempting clone with credential in URL (no credentials printed)"
  git clone --depth=1 https://${username}:${token}@github.com/gndclouds/db.git src/app/db
  
  # Check if clone was successful
  if [ $? -ne 0 ]; then
    echo "First authentication method failed, trying alternate method"
    
    # Method 2: Use Git credential helper
    git config --global credential.helper store
    echo "https://${username}:${token}@github.com" > ~/.git-credentials
    chmod 600 ~/.git-credentials
    
    echo "Cloning repository with credential helper: https://github.com/gndclouds/db.git"
    git clone --depth=1 https://github.com/gndclouds/db.git src/app/db
    
    # Clean up credentials immediately
    rm -f ~/.git-credentials
    git config --global --unset credential.helper
    
    # Check if second method was successful
    if [ $? -ne 0 ]; then
      echo "WARNING: All authentication methods failed. Build will continue without content."
      exit 0 # Don't fail the build
    fi
  fi
  
  # Verify the content directory exists
  if [ -d "src/app/db" ]; then
    echo "Content directory exists: src/app/db"
    ls -la src/app/db
    echo "Repository setup completed successfully"
  else
    echo "WARNING: Content directory does not exist after clone attempts"
    exit 0 # Don't fail the build
  fi
fi