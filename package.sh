#!/bin/bash

echo "Building LinkedIn Post Date Extractor for Chrome Web Store..."
echo ""

# Clean and build
bash build.sh

# Remove old package if exists
rm -rf package
rm -f linkedin-post-date-extractor-v1.0.0.zip

# Create package directory
mkdir -p package

# Copy files to package
echo "Copying files to package directory..."
cp -r dist/* package/

# Create ZIP file
echo "Creating ZIP file for Chrome Web Store..."
cd package
zip -r ../linkedin-post-date-extractor-v1.0.0.zip * -q
cd ..

# Cleanup
rm -rf package

echo ""
echo "========================================"
echo "Package created successfully!"
echo "File: linkedin-post-date-extractor-v1.0.0.zip"
echo ""
echo "Ready to upload to Chrome Web Store!"
echo "========================================"
