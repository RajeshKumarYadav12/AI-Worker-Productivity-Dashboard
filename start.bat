@echo off
REM Quick Start Script for AI Productivity Dashboard (Windows)
REM This script starts all services and seeds the database

echo ============================================
echo 🏭 Starting AI Productivity Dashboard...
echo ============================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Docker is not running. Please start Docker first.
    exit /b 1
)

REM Build and start services
echo 📦 Building and starting services...
docker-compose up --build -d

REM Wait for services to be healthy
echo ⏳ Waiting for services to start (this may take 30-60 seconds)...
timeout /t 30 /nobreak >nul

REM Check service health
echo.
echo 🔍 Checking service health...

docker-compose ps | findstr "mongo" | findstr "Up" >nul
if not errorlevel 1 (
    echo ✅ MongoDB is running
) else (
    echo ❌ MongoDB failed to start
)

docker-compose ps | findstr "backend" | findstr "Up" >nul
if not errorlevel 1 (
    echo ✅ Backend API is running
) else (
    echo ❌ Backend API failed to start
)

docker-compose ps | findstr "frontend" | findstr "Up" >nul
if not errorlevel 1 (
    echo ✅ Frontend is running
) else (
    echo ❌ Frontend failed to start
)

echo.
echo 🌱 Seeding database with dummy data...
timeout /t 5 /nobreak >nul

REM Seed database
curl -X POST http://localhost:5000/api/seed >nul 2>&1

if not errorlevel 1 (
    echo ✅ Database seeded successfully
) else (
    echo ⚠️  Database seeding may have failed. Trying again...
    timeout /t 5 /nobreak >nul
    curl -X POST http://localhost:5000/api/seed
)

echo.
echo ============================================
echo 🎉 Setup Complete!
echo ============================================
echo.
echo 📊 Dashboard: http://localhost:3000
echo 🔌 API:       http://localhost:5000
echo 🗄️  MongoDB:   mongodb://localhost:27017
echo.
echo Commands:
echo   - View logs:     docker-compose logs -f
echo   - Stop:          docker-compose down
echo   - Restart:       docker-compose restart
echo.
echo Happy monitoring! 🚀
pause
