# ConnectX API Testing Script
# This script tests the backend API endpoints

$baseUrl = "http://localhost:4000/api"
$accessToken = ""

Write-Host "🧪 ConnectX API Testing" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "1. Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:4000/" -Method Get
    Write-Host "   ✅ Health check passed: $($response.status)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Health check failed: $_" -ForegroundColor Red
    Write-Host "   Make sure backend is running on port 4000" -ForegroundColor Yellow
    exit
}

Write-Host ""

# Test 2: Sign Up
Write-Host "2. Testing Sign Up..." -ForegroundColor Yellow
$signupData = @{
    name = "Test User $(Get-Date -Format 'HHmmss')"
    email = "test$(Get-Date -Format 'HHmmss')@example.com"
    password = "password123"
    role = "student"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/signup" -Method Post -Body $signupData -ContentType "application/json"
    $accessToken = $response.data.accessToken
    Write-Host "   ✅ Sign up successful!" -ForegroundColor Green
    Write-Host "   User ID: $($response.data.user.id)" -ForegroundColor Gray
    Write-Host "   Email: $($response.data.user.email)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Sign up failed: $_" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "   Error: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}

Write-Host ""

# Test 3: Login
Write-Host "3. Testing Login..." -ForegroundColor Yellow
$loginData = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginData -ContentType "application/json"
    $accessToken = $response.data.accessToken
    Write-Host "   ✅ Login successful!" -ForegroundColor Green
    Write-Host "   Token received: $($accessToken.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "   ⚠️  Login failed (this is OK if user doesn't exist): $_" -ForegroundColor Yellow
}

Write-Host ""

# Test 4: Get Me (if token exists)
if ($accessToken) {
    Write-Host "4. Testing Get Me..." -ForegroundColor Yellow
    $headers = @{
        "Authorization" = "Bearer $accessToken"
    }
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/auth/me" -Method Get -Headers $headers
        Write-Host "   ✅ Get me successful!" -ForegroundColor Green
        Write-Host "   Name: $($response.data.name)" -ForegroundColor Gray
        Write-Host "   Email: $($response.data.email)" -ForegroundColor Gray
        Write-Host "   Role: $($response.data.role)" -ForegroundColor Gray
    } catch {
        Write-Host "   ❌ Get me failed: $_" -ForegroundColor Red
    }
} else {
    Write-Host "4. Skipping Get Me (no token)" -ForegroundColor Yellow
}

Write-Host ""

# Test 5: Get Feed
if ($accessToken) {
    Write-Host "5. Testing Get Feed..." -ForegroundColor Yellow
    $headers = @{
        "Authorization" = "Bearer $accessToken"
    }
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/student/posts/feed?limit=5" -Method Get -Headers $headers
        Write-Host "   ✅ Get feed successful!" -ForegroundColor Green
        Write-Host "   Posts found: $($response.data.posts.Count)" -ForegroundColor Gray
    } catch {
        Write-Host "   ⚠️  Get feed failed (might need posts): $_" -ForegroundColor Yellow
    }
} else {
    Write-Host "5. Skipping Get Feed (no token)" -ForegroundColor Yellow
}

Write-Host ""

# Test 6: Get Clubs
if ($accessToken) {
    Write-Host "6. Testing Get Clubs..." -ForegroundColor Yellow
    $headers = @{
        "Authorization" = "Bearer $accessToken"
    }
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/student/clubs" -Method Get -Headers $headers
        Write-Host "   ✅ Get clubs successful!" -ForegroundColor Green
        Write-Host "   Clubs found: $($response.data.Count)" -ForegroundColor Gray
    } catch {
        Write-Host "   ⚠️  Get clubs failed: $_" -ForegroundColor Yellow
    }
} else {
    Write-Host "6. Skipping Get Clubs (no token)" -ForegroundColor Yellow
}

Write-Host ""

# Test 7: Get Events
if ($accessToken) {
    Write-Host "7. Testing Get Events..." -ForegroundColor Yellow
    $headers = @{
        "Authorization" = "Bearer $accessToken"
    }
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/student/events" -Method Get -Headers $headers
        Write-Host "   ✅ Get events successful!" -ForegroundColor Green
        Write-Host "   Events found: $($response.data.Count)" -ForegroundColor Gray
    } catch {
        Write-Host "   ⚠️  Get events failed: $_" -ForegroundColor Yellow
    }
} else {
    Write-Host "7. Skipping Get Events (no token)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Testing Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Open frontend in browser: http://localhost:8080" -ForegroundColor White
Write-Host "2. Sign up a new user" -ForegroundColor White
Write-Host "3. Test all features in the UI" -ForegroundColor White
Write-Host ""

