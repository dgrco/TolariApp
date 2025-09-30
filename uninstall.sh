#!/usr/bin/env bash

# This file removes the application, its desktop entry, and optionally user data.

set -e

APP="Tolari"
APPIMAGE="$APP-x86_64.AppImage"
INSTALL_DIR="$HOME/.local/bin"
DESKTOP_DIR="$HOME/.local/share/applications"
CONFIG_DIR="$HOME/.config/$APP"
CACHE_DIR="$HOME/.cache/$APP"

# --- Function to Prompt for Yes/No Confirmation ---
# Usage: ask_user "Message to user (Y/n)?"
# Returns 0 for Yes, 1 for No
ask_user() {
    local prompt_message="$1"
    while true; do
        read -r -p "$prompt_message " yn
        case $yn in
            [Yy]* ) return 0; break;; # User answered Yes
            [Nn]* ) return 1; break;; # User answered No
            * ) echo "Please answer yes (y) or no (n).";;
        esac
    done
}

echo "Starting uninstallation of $APP..."

# 1. Ask about clearing the Configuration
if [ -d "$CONFIG_DIR" ]; then
    echo "--------------------------------------------------------"
    echo "Configuration files for $APP were found at $CONFIG_DIR"
    if ask_user "Do you want to permanently clear the configuration (y/n)?"; then
        rm -rf "$CONFIG_DIR"
        echo "Configuration cleared: $CONFIG_DIR"
    else
        echo "Configuration files retained."
    fi
fi

# 2. Ask about clearing the Cache
if [ -d "$CACHE_DIR" ]; then
    echo "--------------------------------------------------------"
    echo "Cache files for $APP were found at $CACHE_DIR"
    if ask_user "Do you want to clear the cache (y/n)? (This will clear ALL data, including flashcards and kanban (planning) cards. Do this only if you will not use Tolari again, or if you want a fresh start.)"; then
        rm -rf "$CACHE_DIR"
        echo "Cache cleared: $CACHE_DIR"
    else
        echo "Cache files retained."
    fi
fi
echo "--------------------------------------------------------"


# 3. Remove the executable from the installation directory
APP_EXECUTABLE="$INSTALL_DIR/$APP"
if [ -f "$APP_EXECUTABLE" ]; then
    rm -f "$APP_EXECUTABLE"
    echo "Removed executable: $APP_EXECUTABLE"
else
    echo "Warning: Executable not found at $APP_EXECUTABLE. Skipping."
fi

# 4. Remove the .desktop file
DESKTOP_FILE="$DESKTOP_DIR/$APP.desktop"
if [ -f "$DESKTOP_FILE" ]; then
    rm -f "$DESKTOP_FILE"
    echo "Removed desktop entry: $DESKTOP_FILE"
    
    # Optional: Update the application menu cache
    if command -v update-desktop-database &> /dev/null; then
        update-desktop-database "$DESKTOP_DIR"
    fi
else
    echo "Warning: Desktop file not found at $DESKTOP_FILE. Skipping."
fi

echo ""
echo "Uninstallation of $APP complete."
