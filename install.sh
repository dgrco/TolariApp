#!/usr/bin/env bash

# This file sets up the AppImage to be executed via an App Launcher

set -e

APP=Tolari
APPIMAGE="$APP-x86_64.AppImage"
INSTALL_DIR="$HOME/.local/bin"
DESKTOP_DIR="$HOME/.local/share/applications"

echo "Installing $APP..."

# Ensure dirs exist
mkdir -p "$INSTALL_DIR" "$DESKTOP_DIR"

# Move binary
cp "$APPIMAGE" "$INSTALL_DIR/$APP"
chmod +x "$INSTALL_DIR/$APP"

# Create .desktop file
cat > "$DESKTOP_DIR/$APP.desktop" <<EOF
[Desktop Entry]
Name=$APP
Exec=$INSTALL_DIR/$APP
Icon=$INSTALL_DIR/$APP
Type=Application
Categories=Utility;
EOF

echo "Done! You can now launch $APP from your app menu."
