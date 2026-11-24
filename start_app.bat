@echo off
title ResumePop AI - Launch App
echo ====================================================================
echo   🌟 LAUNCHING RESUMEPOP AI FULL-STACK WEB APPLICATION
echo   Turn resumes into structured talent data
echo ====================================================================
echo.
echo Starting backend server on http://localhost:5000...
start "ResumePop AI - Backend" cmd /k "cd /d ""%~dp0backend"" && ""..\ResumeParser-master\venv\Scripts\python.exe"" app.py"

echo Waiting for backend to initialize...
timeout /t 3 /nobreak >nul

echo Starting frontend dev server on http://localhost:5173...
start "ResumePop AI - Frontend" cmd /k "cd /d ""%~dp0frontend"" && npm run dev"

echo.
echo ====================================================================
echo   Open your browser at: http://localhost:5173
echo ====================================================================
pause
