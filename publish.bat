@echo off
REM publish.bat - Initialize, commit, and push to Git remote
REM Run from project root: .\publish.bat

setlocal enabledelayedexpansion

REM Check if git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo Git is not installed or not in PATH.
    echo Install from: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo Initializing git repository...
git init
if %errorlevel% neq 0 goto error

echo Staging files...
git add .
if %errorlevel% neq 0 goto error

echo Creating commit...
git commit -m "chore: initial scaffold for Kerry's Fine Painting website"
if %errorlevel% neq 0 (
    if not "%1"=="--force" (
        echo Warning: commit failed. Continuing...
    ) else (
        goto error
    )
)

echo Setting branch to main...
git branch -M main
if %errorlevel% neq 0 goto error

echo Configuring remote origin...
git remote get-url origin >nul 2>nul
if %errorlevel% equ 0 (
    echo Remote already exists. Use: git remote set-url origin https://github.com/MThiede67/KFP.git
) else (
    git remote add origin https://github.com/MThiede67/KFP.git
    if %errorlevel% neq 0 goto error
)

echo Pushing to origin/main...
git push -u origin main
if %errorlevel% neq 0 (
    echo Push failed. Authenticate with GitHub first:
    echo   gh auth login
    echo Or configure credential manager:
    echo   git config --global credential.helper manager-core
    pause
    exit /b 1
)

echo.
echo Success! Repository pushed to GitHub.
pause
exit /b 0

:error
echo Error occurred. Please check the messages above.
pause
exit /b 1
