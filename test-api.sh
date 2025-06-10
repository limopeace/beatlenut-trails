#!/bin/bash

# ESM Portal API Testing Script
# This script provides automated testing without curl approval prompts

BASE_URL="http://localhost:4000/api"

echo "🧪 ESM Portal API Testing Script"
echo "================================="

# Test 1: Health Check
echo "📍 Testing API Health..."
response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X GET "$BASE_URL/esm/products")
http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
if [ "$http_code" -eq 200 ]; then
    echo "✅ API Health Check: PASSED (HTTP $http_code)"
else
    echo "❌ API Health Check: FAILED (HTTP $http_code)"
fi

# Test 2: Seller Registration
echo ""
echo "📍 Testing Seller Registration..."
registration_data='{
    "firstName": "Test",
    "lastName": "Seller", 
    "email": "test.seller@example.com",
    "phone": "9876543210",
    "serviceBackground": "Served in Indian Army for 10 years with expertise in security operations",
    "businessName": "Test Security Services",
    "businessDescription": "Professional security services provided by experienced ex-serviceman",
    "establishmentYear": "2020",
    "address": "123 Test Street",
    "city": "Mumbai", 
    "state": "Maharashtra",
    "pincode": "400001",
    "serviceRadius": "25",
    "categories": ["Security Services"],
    "acceptTerms": true,
    "acceptPrivacyPolicy": true
}'

reg_response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "$BASE_URL/esm/sellers/register" \
    -H "Content-Type: application/json" \
    -d "$registration_data")

reg_http_code=$(echo $reg_response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
if [ "$reg_http_code" -eq 201 ]; then
    echo "✅ Seller Registration: PASSED (HTTP $reg_http_code)"
    # Extract seller ID for further tests
    seller_id=$(echo $reg_response | sed -e 's/HTTPSTATUS:.*//' | grep -o '"_id":"[^"]*"' | cut -d'"' -f4)
    echo "   📝 Created Seller ID: $seller_id"
else
    echo "❌ Seller Registration: FAILED (HTTP $reg_http_code)"
    echo "   📝 Response: $(echo $reg_response | sed -e 's/HTTPSTATUS:.*//')"
fi

# Test 3: Seller Login
echo ""
echo "📍 Testing Seller Login..."
login_data='{
    "email": "test.seller@example.com",
    "password": "TempPass123"
}'

login_response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "$BASE_URL/esm/sellers/login" \
    -H "Content-Type: application/json" \
    -d "$login_data")

login_http_code=$(echo $login_response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
if [ "$login_http_code" -eq 200 ]; then
    echo "✅ Seller Login: PASSED (HTTP $login_http_code)"
    # Extract token for authenticated tests
    token=$(echo $login_response | sed -e 's/HTTPSTATUS:.*//' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    echo "   🔑 Auth Token: ${token:0:20}..."
else
    echo "❌ Seller Login: FAILED (HTTP $login_http_code)"
    echo "   📝 Response: $(echo $login_response | sed -e 's/HTTPSTATUS:.*//')"
fi

# Test 4: Product Creation (if authenticated)
if [ ! -z "$token" ]; then
    echo ""
    echo "📍 Testing Product Creation..."
    product_data='{
        "name": "Test Security Equipment",
        "price": 1500,
        "category": "security-equipment",
        "description": "High-quality security equipment for professional use",
        "stock": 10,
        "images": ["/uploads/test-product.jpg"],
        "tags": ["security", "equipment", "professional"]
    }'
    
    product_response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "$BASE_URL/esm/products" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $token" \
        -d "$product_data")
    
    product_http_code=$(echo $product_response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    if [ "$product_http_code" -eq 201 ]; then
        echo "✅ Product Creation: PASSED (HTTP $product_http_code)"
        product_id=$(echo $product_response | sed -e 's/HTTPSTATUS:.*//' | grep -o '"_id":"[^"]*"' | cut -d'"' -f4)
        echo "   📦 Created Product ID: $product_id"
    else
        echo "❌ Product Creation: FAILED (HTTP $product_http_code)"
        echo "   📝 Response: $(echo $product_response | sed -e 's/HTTPSTATUS:.*//')"
    fi
else
    echo "⏭️  Skipping Product Creation (no auth token)"
fi

echo ""
echo "🏁 Test Summary Complete"
echo "================================="
echo "View detailed logs in backend.log"
echo "API Documentation: http://localhost:4000/api-docs"