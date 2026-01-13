@echo off
echo Building LinkedIn Post Date Extractor for Chrome Web Store...
echo.

REM Clean and build
call build.bat

REM Create package directory
if exist package rmdir /s /q package
mkdir package

REM Copy files to package
echo Copying files to package directory...
xcopy /s /q dist\* package\

REM Create ZIP file
echo Creating ZIP file for Chrome Web Store...
cd package
powershell Compress-Archive -Path * -DestinationPath ../linkedin-post-date-extractor-v1.0.0.zip -Force
cd ..

REM Cleanup
rmdir /s /q package

echo.
echo ========================================
echo Package created successfully!
echo File: linkedin-post-date-extractor-v1.0.0.zip
echo.
echo Ready to upload to Chrome Web Store!
echo ========================================
