@echo off
echo Starting Frontend and Backend Development Servers...
echo.

echo ============================================
echo Starting React Frontend (Port 8082)...
echo ============================================
start "React Frontend" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo ============================================  
echo Starting .NET Backend (Port 5000/5001)...
echo ============================================
start ".NET Backend" cmd /k "cd /d %~dp0\..\OfferingProjectService\API && dotnet run"

echo.
echo ============================================
echo Development servers are starting...
echo Frontend: http://localhost:8082
echo Backend API: http://localhost:5000 or https://localhost:5001
echo ============================================
echo.
echo Press any key to continue...
pause >nul