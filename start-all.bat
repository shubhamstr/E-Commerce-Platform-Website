@echo off
REM ==============================================================================
REM Script: start-all.bat
REM Purpose: Launch Website, Admin, and API in Git Bash tabs in Windows Terminal
REM ==============================================================================

set "SCRIPT_DIR=%~dp0"
if "%SCRIPT_DIR:~-1%"=="\" set "SCRIPT_DIR=%SCRIPT_DIR:~0,-1%"

REM Detect root folder containing the 3 repositories
if exist "%SCRIPT_DIR%\E-Commerce-Platform-Website" (
    set "PROJECTS_ROOT=%SCRIPT_DIR%"
) else if exist "%SCRIPT_DIR%\..\E-Commerce-Platform-Website" (
    set "PROJECTS_ROOT=%SCRIPT_DIR%\.."
) else (
    echo [ERROR] Could not find E-Commerce project folders.
    pause
    exit /b 1
)

set "API_DIR=%PROJECTS_ROOT%\E-Commerce-Platform-API"
set "ADMIN_DIR=%PROJECTS_ROOT%\E-Commerce-Platform-Admin"
set "WEBSITE_DIR=%PROJECTS_ROOT%\E-Commerce-Platform-Website"
set "GIT_BASH=C:\Program Files\Git\bin\bash.exe"

echo ====================================================
echo   E-Commerce Platform - Git Bash Windows Terminal
echo ====================================================
echo   [API]      Port 4005  -^>  http://localhost:4005
echo   [ADMIN]    Port 4002  -^>  http://localhost:4002
echo   [WEBSITE]  Port 4001  -^>  http://localhost:4001
echo ====================================================

if "%1"=="--split" goto split_mode
if "%1"=="-s" goto split_mode

echo Launching API, Admin, and Website in Git Bash tabs (Windows Terminal)...
wt.exe -w new -p "Git Bash" -d "%API_DIR%" --title "API (4005)" --tabColor "#00CED1" "%GIT_BASH%" --login -i -c "npm run dev; exec bash" ; new-tab -p "Git Bash" -d "%ADMIN_DIR%" --title "Admin (4002)" --tabColor "#DA70D6" "%GIT_BASH%" --login -i -c "npm run dev; exec bash" ; new-tab -p "Git Bash" -d "%WEBSITE_DIR%" --title "Website (4001)" --tabColor "#32CD32" "%GIT_BASH%" --login -i -c "npm run dev; exec bash"
goto done

:split_mode
echo Launching API, Admin, and Website in Git Bash split panes (Windows Terminal)...
wt.exe -w new -p "Git Bash" -d "%API_DIR%" --title "API (4005)" --tabColor "#00CED1" "%GIT_BASH%" --login -i -c "npm run dev; exec bash" ; split-pane -V -p "Git Bash" -d "%ADMIN_DIR%" --title "Admin (4002)" --tabColor "#DA70D6" "%GIT_BASH%" --login -i -c "npm run dev; exec bash" ; split-pane -H -p "Git Bash" -d "%WEBSITE_DIR%" --title "Website (4001)" --tabColor "#32CD32" "%GIT_BASH%" --login -i -c "npm run dev; exec bash"

:done

