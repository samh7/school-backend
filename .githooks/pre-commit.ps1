if (Test-Path .env) {
  (Get-Content .env) -replace '=.*', '=' | Set-Content .env.example
  git add .env.example
  Write-Host ".env.example updated"
}
