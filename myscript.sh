#!/bin/bash

# myscript.sh

# Assuming the first command-line argument is the Git URL
GIT_REPOSITORY_URL="$1"
nextDirPath="$2"

# Rest of your script...
outDirPath="$(pwd)/output"
repositoryName=$(echo "${GIT_REPOSITORY_URL}" | awk -F/ '{print $(NF-1)}' | cut -f1 -d'.')
# nextDirPath=`${outDirPath}/${GIT_REPOSITORY_URL}`

# (cd "${outDirPath}/${nextDirPath}" && npm start)
# Stop nodemon temporarily
nodemon emit quit

# Create output directory if it doesn't exist
mkdir -p "${outDirPath}"

# Change to output directory and clone the repository
(cd "${outDirPath}" && git clone "${GIT_REPOSITORY_URL}" && cd "${outDirPath}/${nextDirPath}" && npm install && cd "${outDirPath}/${nextDirPath}" && npm start && set PORT=3000)

# Change to the next directory and run npm install
# (cd "${nextDirPath}" && npm install)

# # Change to the next directory and run npm start
# (cd "${nextDirPath}" && npm start)

# Continue with the rest of your code...
# echo "Script execution successful"
