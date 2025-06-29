#!/bin/bash

# SRS Consulting - Custom Domain Setup Script
# This script helps set up srsconsulting.local for local development

echo "🚀 Setting up custom domain for SRS Consulting..."

# Check if the domain is already in hosts file
if grep -q "srsconsulting.local" /etc/hosts; then
    echo "✅ srsconsulting.local is already configured in /etc/hosts"
else
    echo "📝 Adding srsconsulting.local to /etc/hosts..."
    echo "127.0.0.1 srsconsulting.local" | sudo tee -a /etc/hosts
    echo "✅ Domain added successfully!"
fi

echo ""
echo "🌐 Your SRS Consulting application will be available at:"
echo "   Frontend: http://srsconsulting.local:3000"
echo "   Backend API: http://srsconsulting.local:8000"
echo "   Admin Dashboard: http://srsconsulting.local:3000/admin"
echo "   API Documentation: http://srsconsulting.local:8000/swagger/"
echo "   Health Check: http://srsconsulting.local:8000/api/health/"
echo ""
echo "🔧 To start the application with the new domain:"
echo "   docker-compose up --build"
echo ""
echo "📝 Note: You can still use localhost if needed:"
echo "   Frontend: http://localhost:3000"
echo "   Backend: http://localhost:8000" 