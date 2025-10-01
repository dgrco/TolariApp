#!/usr/bin/env bash

# This file sets up the AppImage to be executed via an App Launcher

set -e

APP=Tolari
APPIMAGE="$APP-x86_64.AppImage"
INSTALL_DIR="$HOME/.local/bin"
DESKTOP_DIR="$HOME/.local/share/applications"
ICON_DIR="$HOME/.local/share/icons"

echo "Installing $APP..."

# Ensure dirs exist
mkdir -p "$INSTALL_DIR" "$DESKTOP_DIR" "$ICON_DIR"

# Move binary
cp "$APPIMAGE" "$INSTALL_DIR/$APPIMAGE"
chmod +x "$INSTALL_DIR/$APPIMAGE"

# Extract icon from AppImage
TEMP_DIR=$(mktemp -d)
"$INSTALL_DIR/$APPIMAGE" --appimage-extract > /dev/null 2>&1
cp squashfs-root/.DirIcon "$ICON_DIR/$APP.svg"
rm -rf squashfs-root

# Create .desktop file
cat > "$DESKTOP_DIR/$APP.desktop" <<EOF
[Desktop Entry]
Name=$APP
Exec=$INSTALL_DIR/$APPIMAGE
Icon=$ICON_DIR/$APP.svg
Type=Application
Categories=Utility;
EOF

if command -v update-desktop-database &> /dev/null; then
    update-desktop-database "$DESKTOP_DIR"
fi

echo ""
echo "Done! You can now launch $APP from your app menu."
