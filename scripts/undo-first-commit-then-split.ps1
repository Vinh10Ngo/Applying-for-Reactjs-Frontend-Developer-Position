# Go commit DAU TIEN (khi khong co HEAD~1) roi tach thanh 9 commit
# Chay: cd E:\cursor_frontend ; .\scripts\undo-first-commit-then-split.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

if (-not (Test-Path .git)) {
    Write-Host "Chua co git." -ForegroundColor Red
    exit 1
}

$count = (git rev-list --count HEAD 2>$null)
if ($count -ne 1) {
    Write-Host "Script nay chi dung khi co DUNG 1 commit. Hien co $count commit." -ForegroundColor Yellow
    Write-Host "Neu co nhieu hon 1 commit, dung: git reset --soft HEAD~1 ; git reset HEAD" -ForegroundColor Yellow
    exit 1
}

Write-Host "Dang go commit dau tien (orphan + unstage)..." -ForegroundColor Cyan
git checkout --orphan temp
git rm -r --cached . 2>$null
git branch -D main
git branch -m main

Write-Host "Dang tach commit theo chuc nang..." -ForegroundColor Cyan
& "$PSScriptRoot\commit-by-feature.ps1"

Write-Host "`nDay len GitHub: git push --force origin main" -ForegroundColor Yellow
