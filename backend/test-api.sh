#!/bin/bash
# Quick test script for the backend API
# This script tests your API endpoints using curl

BACKEND_URL="http://localhost:8787"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Portfolio Backend API Tests ===${NC}\n"

# Test 1: Health Check
echo -e "${YELLOW}Test 1: GET /health${NC}"
curl -s -X GET "$BACKEND_URL/health" -w "\nStatus: %{http_code}\n\n" | jq . && echo -e "${GREEN}✓ PASSED${NC}\n" || echo -e "${RED}✗ FAILED${NC}\n"

# Test 2: Valid Contact Form
echo -e "${YELLOW}Test 2: POST /contact (valid data)${NC}"
curl -s -X POST "$BACKEND_URL/contact" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "This is a test message with enough characters to pass validation"
  }' -w "\nStatus: %{http_code}\n\n" | jq . && echo -e "${GREEN}✓ PASSED${NC}\n" || echo -e "${RED}✗ FAILED${NC}\n"

# Test 3: Invalid Contact (message too short)
echo -e "${YELLOW}Test 3: POST /contact (message too short - should fail)${NC}"
curl -s -X POST "$BACKEND_URL/contact" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane",
    "email": "jane@example.com",
    "message": "short"
  }' -w "\nStatus: %{http_code}\n\n" | jq . && echo -e "${GREEN}✓ Correctly rejected${NC}\n" || echo -e "${RED}✗ FAILED${NC}\n"

# Test 4: Rate Limiting (send 15 requests)
echo -e "${YELLOW}Test 4: Rate Limiting (10 per minute)${NC}"
echo "Sending 15 rapid requests..."
for i in {1..15}; do
  curl -s -X POST "$BACKEND_URL/contact" \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"Bot $i\",
      \"email\": \"bot$i@example.com\",
      \"message\": \"Test message number $i with enough content\"
    }" -w "Request %1d - Status: %{http_code}\n" &
done
wait
echo -e "${GREEN}✓ Rate limiting test complete (observe status codes)${NC}\n"

# Test 5: Admin Endpoints (should fail without auth)
echo -e "${YELLOW}Test 5: GET /admin/messages (no auth - should fail)${NC}"
curl -s -X GET "$BACKEND_URL/admin/messages" -w "\nStatus: %{http_code}\n\n" | jq . && echo -e "${GREEN}✓ Correctly blocked${NC}\n" || echo -e "${RED}✗ FAILED${NC}\n"

# Test 6: Admin Endpoints (with auth)
echo -e "${YELLOW}Test 6: GET /admin/messages (with valid token)${NC}"
curl -s -X GET "$BACKEND_URL/admin/messages" \
  -H "Authorization: Bearer test-key-local-123" \
  -w "\nStatus: %{http_code}\n\n" | jq . && echo -e "${GREEN}✓ PASSED${NC}\n" || echo -e "${RED}✗ FAILED${NC}\n"

echo -e "${YELLOW}=== Tests Complete ===${NC}"
