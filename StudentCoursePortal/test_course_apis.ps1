$ProgressPreference = 'SilentlyContinue'

# 1. Register Student
Write-Host "[1/8] Registering Student..." -ForegroundColor Cyan
$studentRegBody = @{
    username = "student_test"
    password = "password123"
    email    = "student@apex.edu"
    name     = "Test Student"
} | ConvertTo-Json
$studentReg = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method Post -Body $studentRegBody -ContentType "application/json"
Write-Host "SUCCESS: Registered student $($studentReg.username)" -ForegroundColor Green

# 2. Login Student
Write-Host "[2/8] Logging In Student..." -ForegroundColor Cyan
$studentLoginBody = @{
    username = "student_test"
    password = "password123"
} | ConvertTo-Json
$studentAuth = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $studentLoginBody -ContentType "application/json"
$studentToken = $studentAuth.token
Write-Host "SUCCESS: Student logged in. Token: $($studentToken.Substring(0,15))..." -ForegroundColor Green

# 3. Login Admin (Admin seeded in schema.sql: admin / password123)
Write-Host "[3/8] Logging In Admin..." -ForegroundColor Cyan
$adminLoginBody = @{
    username = "admin"
    password = "password123"
} | ConvertTo-Json
$adminAuth = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $adminLoginBody -ContentType "application/json"
$adminToken = $adminAuth.token
Write-Host "SUCCESS: Admin logged in." -ForegroundColor Green

# 4. As Admin, Create Courses (CS101 capacity 2, CS102 capacity 10)
$headersAdmin = @{ Authorization = "Bearer $adminToken" }
$headersStudent = @{ Authorization = "Bearer $studentToken" }

Write-Host "[4/8] Admin Creating Courses..." -ForegroundColor Cyan
$c1Body = @{
    code        = "CS101"
    title       = "Intro to Java"
    description = "Core elements of Java programming"
    instructor  = "Dr. Lovelace"
    capacity    = 2
} | ConvertTo-Json
$c1 = Invoke-RestMethod -Uri "http://localhost:8080/api/courses" -Method Post -Headers $headersAdmin -Body $c1Body -ContentType "application/json"

$c2Body = @{
    code        = "CS102"
    title       = "Database Systems"
    description = "Relational designs and mysql queries"
    instructor  = "Dr. Codd"
    capacity    = 10
} | ConvertTo-Json
$c2 = Invoke-RestMethod -Uri "http://localhost:8080/api/courses" -Method Post -Headers $headersAdmin -Body $c2Body -ContentType "application/json"
Write-Host "SUCCESS: Created courses CS101 and CS102." -ForegroundColor Green

# 5. As Student, List All Courses
Write-Host "[5/8] As Student, Fetching Course Catalog..." -ForegroundColor Cyan
$catalog = Invoke-RestMethod -Uri "http://localhost:8080/api/courses" -Method Get -Headers $headersStudent
Write-Host "SUCCESS: Found $($catalog.Count) courses in catalog." -ForegroundColor Green

# 6. As Student, Enroll in CS101
Write-Host "[6/8] Enrolling Student in CS101..." -ForegroundColor Cyan
Invoke-RestMethod -Uri "http://localhost:8080/api/students/courses/$($c1.id)/enroll" -Method Post -Headers $headersStudent
Write-Host "SUCCESS: Enrolled student in CS101." -ForegroundColor Green

# 7. As Student, Verify Enrolled Courses Listings
Write-Host "[7/8] Inquiring Enrolled Courses Listings..." -ForegroundColor Cyan
$enrolled = Invoke-RestMethod -Uri "http://localhost:8080/api/students/courses" -Method Get -Headers $headersStudent
Write-Host "SUCCESS: Student is enrolled in $($enrolled.title)" -ForegroundColor Green

# 8. Register Another Student, Enroll them in CS101 (Enrollment Count = 2)
# Register a 3rd student, enroll them in CS101 -> check if capacity block triggers custom Exception
Write-Host "[8/8] Testing Capacity Limit Checks..." -ForegroundColor Cyan
# student 2
$s2Reg = @{ username = "stud2"; password = "password"; email = "s2@a.edu"; name = "S2" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method Post -Body $s2Reg -ContentType "application/json" > $null
$s2Auth = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body (@{username = "stud2"; password = "password" } | ConvertTo-Json) -ContentType "application/json"
$s2Token = $s2Auth.token
Invoke-RestMethod -Uri "http://localhost:8080/api/students/courses/$($c1.id)/enroll" -Method Post -Headers @{ Authorization = "Bearer $s2Token" } > $null

# student 3
$s3Reg = @{ username = "stud3"; password = "password"; email = "s3@a.edu"; name = "S3" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method Post -Body $s3Reg -ContentType "application/json" > $null
$s3Auth = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body (@{username = "stud3"; password = "password" } | ConvertTo-Json) -ContentType "application/json"
$s3Token = $s3Auth.token

try {
    Invoke-RestMethod -Uri "http://localhost:8080/api/students/courses/$($c1.id)/enroll" -Method Post -Headers @{ Authorization = "Bearer $s3Token" }
    Write-Host "FAILURE: Enrolled past capacity!" -ForegroundColor Red
}
catch {
    $errRes = $_.Exception.Response
    $stream = $errRes.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $text = $reader.ReadToEnd()
    Write-Host "SUCCESS: Caught capacity exception checking:" -ForegroundColor Green
    Write-Host $text -ForegroundColor Yellow
}
