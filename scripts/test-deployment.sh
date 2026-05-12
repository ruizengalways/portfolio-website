#!/bin/bash

# Deployment Testing Script for Portfolio Website
# This script tests the deployed application to ensure everything works correctly

set -e

# Configuration
BACKEND_URL="${BACKEND_URL:-https://your-worker.workers.dev}"
FRONTEND_URL="${FRONTEND_URL:-https://your-pages.pages.dev}"

echo "🚀 Starting deployment tests..."
echo "Backend URL: $BACKEND_URL"
echo "Frontend URL: $FRONTEND_URL"
echo

# Function to test HTTP response
test_endpoint() {
    local url=$1
    local expected_status=${2:-200}
    local method=${3:-GET}
    local data=$4

    echo "Testing $method $url (expecting $expected_status)"

    if [ "$method" = "POST" ] && [ -n "$data" ]; then
        response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST -H "Content-Type: application/json" -d "$data" "$url")
    else
        response=$(curl -s -w "HTTPSTATUS:%{http_code}" "$url")
    fi

    http_code=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

    if [ "$http_code" -eq "$expected_status" ]; then
        echo "✅ PASS: Got expected status $expected_status"
        return 0
    else
        echo "❌ FAIL: Got status $http_code, expected $expected_status"
        echo "Response: $response"
        return 1
    fi
}

# Test Backend Endpoints
echo "🔧 Testing Backend API..."

# Health check
test_endpoint "$BACKEND_URL/health" 200

# Visit endpoint (GET)
test_endpoint "$BACKEND_URL/visit" 200

# Visit endpoint (POST)
visit_data='{"page": "/test", "timestamp": "'$(date -Iseconds)'"}'
test_endpoint "$BACKEND_URL/visit" 200 POST "$visit_data"

# Contact endpoint (valid data)
contact_data='{"name": "Test User", "email": "test@example.com", "message": "This is a test message from deployment testing."}'
test_endpoint "$BACKEND_URL/contact" 201 POST "$contact_data"

# Contact endpoint (invalid data - short message)
invalid_contact_data='{"name": "Test", "email": "test@example.com", "message": "Hi"}'
test_endpoint "$BACKEND_URL/contact" 400 POST "$invalid_contact_data"

# Admin endpoint (should be protected)
test_endpoint "$BACKEND_URL/admin/stats" 401

echo

# Test Frontend
echo "🌐 Testing Frontend..."

# Test if frontend loads
test_endpoint "$FRONTEND_URL" 200

# Test security headers on backend
echo "🔒 Testing Security Headers..."

security_response=$(curl -s -I "$BACKEND_URL/health")
echo "Security headers check:"
echo "$security_response" | grep -E "(X-Content-Type-Options|X-Frame-Options|X-XSS-Protection|Referrer-Policy|Strict-Transport-Security)" || echo "Some security headers missing"

echo

# Test CORS
echo "🌍 Testing CORS..."

cors_response=$(curl -s -H "Origin: $FRONTEND_URL" -H "Access-Control-Request-Method: POST" -X OPTIONS "$BACKEND_URL/contact")
if echo "$cors_response" | grep -q "Access-Control-Allow-Origin"; then
    echo "✅ CORS headers present"
else
    echo "❌ CORS headers missing"
fi

echo

# Performance test
echo "⚡ Basic Performance Test..."

# Test response time
start_time=$(date +%s%N)
curl -s "$BACKEND_URL/health" > /dev/null
end_time=$(date +%s%N)
response_time=$(( (end_time - start_time) / 1000000 ))  # Convert to milliseconds

if [ "$response_time" -lt 1000 ]; then
    echo "✅ Response time: ${response_time}ms (Good)"
else
    echo "⚠️  Response time: ${response_time}ms (Slow)"
fi

echo
echo "🎉 Deployment testing completed!"
echo
echo "Manual checks you should perform:"
echo "1. Visit $FRONTEND_URL in a browser"
echo "2. Test the contact form submission"
echo "3. Check mobile responsiveness"
echo "4. Verify all links and navigation work"
echo "5. Test in different browsers (Chrome, Firefox, Safari)"
echo
echo "If all tests pass, your deployment is successful! 🚀"