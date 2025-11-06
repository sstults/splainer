#!/bin/bash

# Script to handle large number of git changes incrementally
# This script processes git changes in small batches to avoid overwhelming the system

set -e  # Exit on any error

echo "=== Git Change Handler Script ==="
echo "Processing git changes in incremental batches..."

# Create log file
LOG_FILE="/work/scripts/git-change-log.txt"
echo "Git change processing log - $(date)" > $LOG_FILE
echo "================================" >> $LOG_FILE

# Function to log messages
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

# Function to process a batch of changes
process_batch() {
    local batch_size=${1:-20}
    local start_index=${2:-0}
    
    log_message "Processing batch of $batch_size changes starting from index $start_index"
    
    # Get the list of changes
    local changes=$(git status --porcelain | sed -n "$((start_index + 1)),$((start_index + batch_size))p")
    
    if [ -z "$changes" ]; then
        log_message "No more changes to process"
        return 1
    fi
    
    local change_count=$(echo "$changes" | wc -l)
    log_message "Processing $change_count changes in this batch"
    
    # Process each change
    local line_num=0
    echo "$changes" | while IFS= read -r change; do
        if [ -n "$change" ]; then
            line_num=$((line_num + 1))
            log_message "Processing change $line_num/$change_count: $change"
            
            # Extract file status and path
            local status=$(echo "$change" | cut -c1-2 | tr -d ' ')
            local file_path=$(echo "$change" | cut -c4-)
            
            case "$status" in
                "D")
                    log_message "  Deleting file: $file_path"
                    rm -f "$file_path" 2>/dev/null || true
                    ;;
                "M")
                    log_message "  Modifying file: $file_path"
                    # For modified files, we can just let git handle it
                    ;;
                "A")
                    log_message "  Adding file: $file_path"
                    # For new files, we can just let git handle it
                    ;;
                "R")
                    log_message "  Renaming file: $file_path"
                    # For renamed files, we can just let git handle it
                    ;;
                "?")
                    log_message "  Untracked file: $file_path"
                    # For untracked files, we can just let git handle it
                    ;;
                *)
                    log_message "  Unknown status for $file_path: $status"
                    ;;
            esac
        fi
    done
    
    log_message "Completed batch processing"
    return 0
}

# Main processing loop
main() {
    log_message "Starting incremental git change processing"
    
    # Get total number of changes
    local total_changes=$(git status --porcelain | wc -l)
    local batch_size=10  # Process 10 changes at a time
    
    log_message "Total changes to process: $total_changes"
    
    if [ $total_changes -eq 0 ]; then
        log_message "No changes to process"
        echo "No changes to process"
        return 0
    fi
    
    # Process changes in batches
    local current_index=0
    local batch_count=0
    
    while true; do
        batch_count=$((batch_count + 1))
        log_message "Starting batch $batch_count"
        
        if ! process_batch $batch_size $current_index; then
            log_message "All changes processed successfully"
            break
        fi
        
        current_index=$((current_index + batch_size))
        
        # Add a small delay to prevent overwhelming the system
        sleep 1
        
        # Check if we've processed all changes
        local remaining_changes=$((total_changes - current_index))
        if [ $remaining_changes -le 0 ]; then
            log_message "All changes processed successfully"
            break
        fi
        
        log_message "Remaining changes: $remaining_changes"
    done
    
    log_message "Git change processing completed"
    echo "Git change processing completed successfully"
}

# Run main function
main "$@"

echo "=== Git Change Handler Script Complete ==="
