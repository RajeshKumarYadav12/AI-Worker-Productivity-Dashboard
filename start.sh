#!/bin/bash

# Quick Start Script for AI Productivity Dashboard
# This script starts all services and seeds the database

echo "🏭 Starting AI Productivity Dashboard..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running. Please start Docker first."
    exit 1
fi

# Build and start services
echo "📦 Building and starting services..."
docker-compose up --build -d

# Wait for services to be healthy
echo "⏳ Waiting for services to start (this may take 30-60 seconds)..."
sleep 30

# Check service health
echo ""
echo "🔍 Checking service health..."

# Check MongoDB
if docker-compose ps | grep -q "mongo.*Up"; then
    echo "✅ MongoDB is running"
else
    echo "❌ MongoDB failed to start"
fi

# Check Backend
if docker-compose ps | grep -q "backend.*Up"; then
    echo "✅ Backend API is running"
else
    echo "❌ Backend API failed to start"
fi

# Check Frontend
if docker-compose ps | grep -q "frontend.*Up"; then
    echo "✅ Frontend is running"
else
    echo "❌ Frontend failed to start"
fi

echo ""
echo "🌱 Seeding database with dummy data..."
sleep 5

# Seed database
curl -X POST http://localhost:5000/api/seed -s > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Database seeded successfully"
else
    echo "⚠️  Database seeding may have failed. Trying again..."
    sleep 5
    curl -X POST http://localhost:5000/api/seed
fi

echo ""
echo "============================================"
echo "🎉 Setup Complete!"
echo "============================================"
echo ""
echo "📊 Dashboard: http://localhost:3000"
echo "🔌 API:       http://localhost:5000"
echo "🗄️  MongoDB:   mongodb://localhost:27017"
echo ""
echo "Commands:"
echo "  - View logs:     docker-compose logs -f"
echo "  - Stop:          docker-compose down"
echo "  - Restart:       docker-compose restart"
echo ""
echo "Happy monitoring! 🚀"
