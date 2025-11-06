#!/bin/bash

# Script to cleanup defunct git processes
# This script identifies and kills defunct git processes that are consuming system resources

echo "Cleaning up defunct git processes..."

# Find all defunct git processes
DEFUNCT_PROCESSES=$(ps aux | grep "git.*<defunct>" | grep -v grep | awk '{print $2}')

if [ -z "$DEFUNCT_PROCESSES" ]; then
    echo "No defunct git processes found."
else
    echo "Found defunct git processes:"
    echo "$DEFUNCT_PROCESSES"
    
    # Kill each defunct process
    for pid in $DEFUNCT_PROCESSES; do
        echo "Killing defunct git process $pid..."
        kill -9 $pid 2>/dev/null || true
    done
    
    echo "Defunct git processes cleanup completed."
fi

# Also check for any hanging git operations
echo "Checking for any remaining git processes..."
GIT_PROCESSES=$(ps aux | grep "git " | grep -v grep | awk '{print $2}')
if [ -n "$GIT_PROCESSES" ]; then
    echo "Remaining git processes (may be normal):"
    echo "$GIT_PROCESSES"
else
    echo "No remaining git processes found."
fi

echo "Cleanup script execution completed."
