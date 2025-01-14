#!/bin/bash

# Define variables for new URL components
username=$GIT_USERNAME
token=$GIT_ACCESS_TOKEN
submodule_url="https://${username}:${token}@github.com/gndclouds/db.git"
submodule_path="src/app/db"

# Remove existing submodule directory if it exists
rm -rf $submodule_path

# Clone the submodule repository
git clone $submodule_url $submodule_path