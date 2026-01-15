#!/bin/bash

echo "Building LinkedIn Post Date Extractor..."
echo ""

# Clean dist folder
if [ -d "dist" ]; then
    echo "Cleaning dist folder..."
    rm -rf dist
fi

# Create dist folder structure
echo "Creating dist folder..."
mkdir -p dist/icons

# Copy extension files
echo "Copying extension files..."
cp manifest.json dist/
cp popup.html dist/
cp popup.js dist/
cp styles.css dist/

cp README.md dist/
cp LICENSE dist/

# Copy icons
echo "Copying icons..."
cp icons/*.png dist/icons/

echo ""
echo "✓ Build complete! Extension is ready in the 'dist' folder."
echo ""
echo "To load in Chrome:"
echo "1. Open chrome://extensions/"
echo "2. Enable Developer mode"
echo "3. Click 'Load unpacked'"
echo "4. Select the 'dist' folder"
echo ""
