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

# AppImage Setup
echo "Creating AppImage and placing it in $RELEASE_DIR/$APP..."

mkdir -p "$APP.AppDir/usr/bin" 

# Copy binary
cp build/bin/Tolari "$APP.AppDir/usr/bin"

# Copy icon
cp build/appicon.png "$APP.AppDir/icon.png"

# Create a desktop file
cat > "$APP.AppDir/myapp.desktop" <<EOF
[Desktop Entry]
Name=Tolari
Exec=Tolari
Icon=icon
Type=Application
Categories=Utility;
EOF

# Create AppRun (entry point)
cat > "$APP.AppDir/AppRun" <<'EOF'
#!/bin/bash
HERE="$(dirname "$(readlink -f "$0")")"
exec "$HERE/usr/bin/myapp" "$@"
EOF
chmod +x "$APP.AppDir/AppRun"

echo "--------------------------- IGNORE ---------------------------"
ARCH=x86_64 appimagetool "$APP.AppDir"
mv "$APP.AppDir" "$RELEASE_DIR/$APP"
echo "--------------------------- IGNORE ---------------------------"

echo "Copying LICENSE to $RELEASE_DIR/$APP..."
cp LICENSE "$RELEASE_DIR/$APP"

echo "Copying README-linux.md to $RELEASE_DIR/$APP/README.md..."
cp README-linux.md "$RELEASE_DIR/$APP/README.md"

echo "Copying install/uninstall scripts to $RELEASE_DIR/$APP..."
cp install.sh uninstall.sh "$RELEASE_DIR/$APP"

echo "Archiving and compressing to $RELEASE_DIR/$APP.tar.gz..."
cd "$RELEASE_DIR" && tar -czf "$APP.tar.gz" "$APP"
cd ../../

echo "Done! Find the tarball in $RELEASE_DIR."
