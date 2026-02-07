# Chay script nay trong thu muc du an (E:\cursor_frontend)
# Cach chay: phai chuot phai fix-git.ps1 -> Run with PowerShell
#     HOAC trong PowerShell: cd E:\cursor_frontend ; .\fix-git.ps1

$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot

Write-Host "Thu muc du an: $ProjectRoot" -ForegroundColor Cyan
Set-Location $ProjectRoot

# Xoa .git cu (tranh loi config.lock)
if (Test-Path ".git") {
    Write-Host "Dang xoa thu muc .git cu..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force ".git"
}

Write-Host "Dang chay git init..." -ForegroundColor Yellow
git init

Write-Host "Dang them remote origin..." -ForegroundColor Yellow
git remote add origin "https://github.com/Vinh10Ngo/Applying-for-Reactjs-Frontend-Developer-Position.git"

Write-Host "`nXong. Tiep theo chay lan luot:" -ForegroundColor Green
Write-Host "  git add ." -ForegroundColor White
Write-Host "  git commit -m `"Initial commit`"" -ForegroundColor White
Write-Host "  git branch -M main" -ForegroundColor White
Write-Host "  git push -u origin main" -ForegroundColor White
