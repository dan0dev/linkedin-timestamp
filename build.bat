@echo off
echo Building LinkedIn Post Date Extractor...
echo.

REM Clean dist folder
if exist dist (
    echo Cleaning dist folder...
    rmdir /s /q dist
)

REM Create dist folder structure
echo Creating dist folder...
mkdir dist
mkdir dist\icons

REM Copy extension files
echo Copying extension files...
copy manifest.json dist\ >nul
copy popup.html dist\ >nul
copy popup.js dist\ >nul
copy styles.css dist\ >nul

copy README.md dist\ >nul
copy LICENSE dist\ >nul

REM Copy icons
echo Copying icons...
copy icons\*.png dist\icons\ >nul

echo.
echo ✓ Build complete! Extension is ready in the 'dist' folder.
echo.
echo To load in Chrome:
echo 1. Open chrome://extensions/
echo 2. Enable Developer mode
echo 3. Click 'Load unpacked'
echo 4. Select the 'dist' folder
echo.
pause
