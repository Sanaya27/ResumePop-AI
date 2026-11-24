@echo off
title ResumePop AI - Backend Server
echo ==================================================
echo   🚀 Starting ResumePop AI Backend (Flask API)
echo   Turn resumes into structured talent data
echo ==================================================
cd /d "%~dp0backend"
"..\ResumeParser-master\venv\Scripts\python.exe" app.py
pause
