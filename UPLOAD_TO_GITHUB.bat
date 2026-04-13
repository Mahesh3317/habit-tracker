@echo off
REM GitHub Upload Script for Habit Tracker
REM This script helps you upload the app to GitHub

echo.
echo ====================================
echo   Habit Tracker - GitHub Upload
echo ====================================
echo.

set /p username="Enter your GitHub username: "
set /p reponame="Enter repository name (default: habit-tracker): "
if "%reponame%"=="" set reponame=habit-tracker

echo.
echo Setting up GitHub remote...
echo.

REM Configure git
git config --global user.name "Mahesh Sharma"
git config --global user.email "maheshsharma14051@gmail.com"

REM Add remote
git remote remove origin 2>nul
git remote add origin https://github.com/%username%/%reponame%.git

REM Rename branch to main
git branch -M main

REM Push to GitHub
echo.
echo Pushing to GitHub...
echo Repository: https://github.com/%username%/%reponame%
echo.
git push -u origin main

echo.
echo ====================================
echo   Upload Complete!
echo ====================================
echo.
echo Your app is now on GitHub at:
echo https://github.com/%username%/%reponame%
echo.
echo Next steps:
echo 1. Visit the URL above to verify
echo 2. Add description and topics on GitHub
echo 3. Share your portfolio link!
echo.
pause
