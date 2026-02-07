# Go 1 commit roi chay tach commit theo chuc nang
# Chay: cd E:\cursor_frontend ; .\scripts\reset-and-split-commits.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

if (-not (Test-Path .git)) {
    Write-Host "Chua co git." -ForegroundColor Red
    exit 1
}

$count = (git rev-list --count HEAD 2>$null)
if ($count -eq 0) {
    Write-Host "Chua co commit nao." -ForegroundColor Red
    exit 1
}
if ($count -gt 1) {
    Write-Host "Co nhieu hon 1 commit. Chi go commit moi nhat (HEAD~1)." -ForegroundColor Yellow
}

Write-Host "Dang go 1 commit cu (giu nguyen thay doi trong thu muc lam viec)..." -ForegroundColor Cyan
git reset --soft HEAD~1
git reset HEAD

Write-Host "Dang chay tach commit theo chuc nang..." -ForegroundColor Cyan
& "$PSScriptRoot\commit-by-feature.ps1"

Write-Host "`nNeu da push len GitHub truoc do, day lai bang:" -ForegroundColor Yellow
Write-Host "  git push --force origin main" -ForegroundColor White
