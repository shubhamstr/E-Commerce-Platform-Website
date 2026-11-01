#!/usr/bin/env bash

# ==============================================================================
# Script: start-all.sh
# Purpose: Start E-Commerce Platform Website, Admin, and API inside a single
#          Windows Terminal window using Git Bash tabs (or split panes).
# ==============================================================================

# Text formatting & colors
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Determine script location
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Locate project root containing the 3 repositories
if [ -d "$SCRIPT_DIR/E-Commerce-Platform-Website" ] && [ -d "$SCRIPT_DIR/E-Commerce-Platform-Admin" ] && [ -d "$SCRIPT_DIR/E-Commerce-Platform-API" ]; then
    PROJECTS_ROOT="$SCRIPT_DIR"
elif [ -d "$SCRIPT_DIR/../E-Commerce-Platform-Website" ] && [ -d "$SCRIPT_DIR/../E-Commerce-Platform-Admin" ] && [ -d "$SCRIPT_DIR/../E-Commerce-Platform-API" ]; then
    PROJECTS_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
elif [ -d "./E-Commerce-Platform-Website" ] && [ -d "./E-Commerce-Platform-Admin" ] && [ -d "./E-Commerce-Platform-API" ]; then
    PROJECTS_ROOT="$(pwd)"
elif [ -d "../E-Commerce-Platform-Website" ] && [ -d "../E-Commerce-Platform-Admin" ] && [ -d "../E-Commerce-Platform-API" ]; then
    PROJECTS_ROOT="$(cd .. && pwd)"
else
    echo -e "${RED}[ERROR] Could not find E-Commerce project folders (API, Admin, Website).${NC}"
    echo "Please ensure this script is run from within the workspace root or one of the project folders."
    exit 1
fi

API_DIR="$PROJECTS_ROOT/E-Commerce-Platform-API"
ADMIN_DIR="$PROJECTS_ROOT/E-Commerce-Platform-Admin"
WEBSITE_DIR="$PROJECTS_ROOT/E-Commerce-Platform-Website"

# Locate Git Bash executable
GIT_BASH="C:\\Program Files\\Git\\bin\\bash.exe"
if [ ! -f "C:/Program Files/Git/bin/bash.exe" ]; then
    if [ -f "C:/Program Files (x86)/Git/bin/bash.exe" ]; then
        GIT_BASH="C:\\Program Files (x86)\\Git\\bin\\bash.exe"
    elif command -v bash >/dev/null 2>&1; then
        GIT_BASH="$(command -v bash)"
    fi
fi

# Convert Unix / MSYS paths to native Windows paths for Windows Terminal
to_win_path() {
    local p="$1"
    if command -v cygpath >/dev/null 2>&1; then
        cygpath -w "$p"
    elif command -v wslpath >/dev/null 2>&1; then
        wslpath -w "$p"
    else
        echo "$p"
    fi
}

WIN_API_DIR="$(to_win_path "$API_DIR")"
WIN_ADMIN_DIR="$(to_win_path "$ADMIN_DIR")"
WIN_WEBSITE_DIR="$(to_win_path "$WEBSITE_DIR")"

echo -e "${BOLD}${YELLOW}====================================================${NC}"
echo -e "${BOLD}${YELLOW}  E-Commerce Platform - Git Bash Windows Terminal   ${NC}"
echo -e "${BOLD}${YELLOW}====================================================${NC}"
echo -e "  ${CYAN}[API]${NC}      Port 4005  ->  http://localhost:4005"
echo -e "  ${MAGENTA}[ADMIN]${NC}    Port 4002  ->  http://localhost:4002"
echo -e "  ${GREEN}[WEBSITE]${NC}  Port 4001  ->  http://localhost:4001"
echo -e "${BOLD}${YELLOW}====================================================${NC}"

# Check for Windows Terminal (wt.exe)
if ! command -v wt.exe >/dev/null 2>&1 && ! [ -f "/c/Users/$USER/AppData/Local/Microsoft/WindowsApps/wt.exe" ]; then
    echo -e "${RED}[WARNING] Windows Terminal (wt.exe) was not found in PATH.${NC}"
    echo "Opening separate Git Bash windows..."
    "$GIT_BASH" --login -i -c "cd '$API_DIR' && npm run dev; exec bash" &
    "$GIT_BASH" --login -i -c "cd '$ADMIN_DIR' && npm run dev; exec bash" &
    "$GIT_BASH" --login -i -c "cd '$WEBSITE_DIR' && npm run dev; exec bash" &
    exit 0
fi

MODE="tabs"
if [ "$1" = "--split" ] || [ "$1" = "-s" ]; then
    MODE="split"
fi

if [ "$MODE" = "split" ]; then
    echo -e "${GREEN}Launching all 3 services in Git Bash Split Panes (Single Window)...${NC}"
    wt.exe -w new \
        -p "Git Bash" -d "$WIN_API_DIR" --title "API (4005)" --tabColor "#00CED1" "$GIT_BASH" --login -i -c "npm run dev; exec bash" ';' \
        split-pane -V -p "Git Bash" -d "$WIN_ADMIN_DIR" --title "Admin (4002)" --tabColor "#DA70D6" "$GIT_BASH" --login -i -c "npm run dev; exec bash" ';' \
        split-pane -H -p "Git Bash" -d "$WIN_WEBSITE_DIR" --title "Website (4001)" --tabColor "#32CD32" "$GIT_BASH" --login -i -c "npm run dev; exec bash"
else
    echo -e "${GREEN}Launching all 3 services in Git Bash Tabs (Single Window)...${NC}"
    echo -e "${YELLOW}(Tip: use './start-all.sh --split' to view them in tiled split panes instead)${NC}"
    wt.exe -w new \
        -p "Git Bash" -d "$WIN_API_DIR" --title "API (4005)" --tabColor "#00CED1" "$GIT_BASH" --login -i -c "npm run dev; exec bash" ';' \
        new-tab -p "Git Bash" -d "$WIN_ADMIN_DIR" --title "Admin (4002)" --tabColor "#DA70D6" "$GIT_BASH" --login -i -c "npm run dev; exec bash" ';' \
        new-tab -p "Git Bash" -d "$WIN_WEBSITE_DIR" --title "Website (4001)" --tabColor "#32CD32" "$GIT_BASH" --login -i -c "npm run dev; exec bash"
fi

echo -e "\n${BOLD}${GREEN}Successfully launched Git Bash tabs in Windows Terminal!${NC}"
