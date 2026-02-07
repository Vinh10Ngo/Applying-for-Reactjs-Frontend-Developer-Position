# Them Node.js vao PATH cho session hien tai (neu cai o thu muc mac dinh)
$nodePaths = @(
    "C:\Program Files\nodejs",
    "$env:ProgramFiles\nodejs",
    "${env:ProgramFiles(x86)}\nodejs"
)
$found = $false
foreach ($p in $nodePaths) {
    if (Test-Path $p) {
        $env:Path = "$p;$env:Path"
        Write-Host "Da them vao PATH: $p" -ForegroundColor Green
        $found = $true
        break
    }
}
if (-not $found) {
    Write-Host "Khong tim thay Node.js. Hay cai tu: https://nodejs.org (ban LTS)" -ForegroundColor Yellow
    exit 1
}
Write-Host "Kiem tra: node -v va npm -v"
node -v
npm -v
