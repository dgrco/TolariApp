#!/usr/bin/env bash

# This script bundles everything for release on github.

set -e

APP=Tolari
APPIMAGE="$APP-x86_64.AppImage"
RELEASE_DIR="build/release"

if [ -d "$RELEASE_DIR" ]; then
    echo "Detected release directory. Clearing..."
    rm -rf "$RELEASE_DIR"
    echo "Cleared successfully"
fi

echo "Packaging $APP..."

# Recreate the release directory
mkdir -p "$RELEASE_DIR" "$RELEASE_DIR/$APP"

if [ ! -f "$APPIMAGE" ]; then
    echo "ERROR: Build the AppImage using 'wails build' and make sure its in the root directory."
    exit 1
fi

echo "Copying $APPIMAGE to $RELEASE_DIR..."
cp "$APPIMAGE" "$RELEASE_DIR/$APP"

echo "Copying LICENSE to $RELEASE_DIR..."
cp LICENSE "$RELEASE_DIR/$APP"

echo "Copying README-linux.md to $RELEASE_DIR..."
cp README-linux.md "$RELEASE_DIR/$APP"

echo "Copying install/uninstall scripts to $RELEASE_DIR..."
cp install.sh uninstall.sh "$RELEASE_DIR/$APP"

echo "Archiving and compressing to $RELEASE_DIR/$APP.tar.gz..."
cd "$RELEASE_DIR" && tar -czf "$APP.tar.gz" "$APP"
cd ../../

echo "Done! Find the tarball in $RELEASE_DIR."
