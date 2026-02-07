# Dung npm di kem Node.js (bo qua npm bi hong o AppData\Roaming)
$nodePath = (Get-Command node -ErrorAction SilentlyContinue).Source
if (-not $nodePath) {
    Write-Host "Khong tim thay node. Hay cai Node.js tu https://nodejs.org" -ForegroundColor Red
    exit 1
}
$nodeDir = Split-Path $nodePath -Parent
$npmCmd = Join-Path $nodeDir "npm.cmd"
if (-not (Test-Path $npmCmd)) {
    Write-Host "Khong tim thay npm.cmd tai: $npmCmd" -ForegroundColor Red
    exit 1
}
Write-Host "Dang dung npm tai: $npmCmd" -ForegroundColor Green
& $npmCmd @args
