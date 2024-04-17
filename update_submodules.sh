#!/bin/bash
# Initialize submodules if they haven't been initialized
git submodule update --init --recursive

# Navigate into the submodule directory
cd db

# Fetch the latest changes from the remote repository
git fetch

# Checkout the latest commit on the main branch (or any branch you wish to track)
git checkout main
git pull origin main

# Navigate back to the root directory of your main project
cd ..

# Add the submodule changes (which now points to the latest commit) to be committed in your main project
git add db

# Optionally, commit the change in your main project to record the update to the submodule
git commit -m "Updated db submodule to the latest commit"

# Note: You might want to adjust the branch name 'main' if the submodule uses a different branch as its default.