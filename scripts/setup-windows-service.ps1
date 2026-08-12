# VatanKepServer'i Windows servisi olarak kurar (OPC toplayicilar + web dashboard).
# Yonetici olarak PowerShell'de calistirin:
#   git clone https://github.com/Vatan059/VatanKepServer.git C:\VatanKepServer
#   cd C:\VatanKepServer
#   .\scripts\setup-windows-service.ps1

$ErrorActionPreference = "Stop"

$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
  Write-Host "Bu betik yonetici olarak calistirilmali. PowerShell'i 'Yonetici olarak calistir' ile acip tekrar deneyin." -ForegroundColor Red
  exit 1
}

$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

function Ensure-Command($cmd, $wingetId) {
  if (Get-Command $cmd -ErrorAction SilentlyContinue) { return }
  Write-Host "$cmd bulunamadi, winget ile kuruluyor ($wingetId)..." -ForegroundColor Yellow
  if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
    throw "$cmd kurulu degil ve winget bulunamadi. Once $cmd'i elle kurup betigi tekrar calistirin."
  }
  winget install -e --id $wingetId --accept-source-agreements --accept-package-agreements
  $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
  if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) {
    throw "$cmd kurulumdan sonra bulunamadi. Yeni bir terminal acip betigi tekrar calistirin (PATH guncellemesi icin)."
  }
}

Ensure-Command "node" "OpenJS.NodeJS.LTS"
Write-Host "Node: $(node -v)  npm: $(npm -v)"

if (-not (Test-Path "$ProjectRoot\.env")) {
  Write-Host ".env bulunamadi, varsayilan degerlerle olusturuluyor..." -ForegroundColor Yellow
  @"
OPCUA_ENDPOINT=opc.tcp://192.168.5.95:49320

# Min/Max sinir asimi e-posta uyarilari icin SMTP ayarlari.
# Bos birakilirsa e-posta gonderilmez, sadece konsola yazilir.
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
ALERT_TO=
ALERT_REPEAT_MINUTES=30
"@ | Set-Content -Encoding utf8 "$ProjectRoot\.env"
  Write-Host "NOT: E-posta uyarilari icin SMTP bilgilerini doldurmak isterseniz $ProjectRoot\.env dosyasini duzenleyin." -ForegroundColor Yellow
}

Write-Host "Bagimliliklar kuruluyor (npm install)..." -ForegroundColor Cyan
npm install

Write-Host "TypeScript derleniyor (npm run build)..." -ForegroundColor Cyan
npm run build

New-Item -ItemType Directory -Force -Path "$ProjectRoot\logs" | Out-Null

$services = @(
  @{ Name = "VatanKep-Toplayici"; Script = "dist\index.js"; Desc = "VatanKepServer - OPC UA veri toplama" },
  @{ Name = "VatanKep-AlCcrline"; Script = "dist\alccrline.js"; Desc = "VatanKepServer - AL CCRLINE veri toplama" },
  @{ Name = "VatanKep-Dashboard"; Script = "dist\server.js"; Desc = "VatanKepServer - Web dashboard (port 3500)" }
)

foreach ($svc in $services) {
  Write-Host "Servis kuruluyor: $($svc.Name)" -ForegroundColor Cyan
  node "$ProjectRoot\scripts\win-service-install.js" --name "$($svc.Name)" --desc "$($svc.Desc)" --script "$ProjectRoot\$($svc.Script)" --root "$ProjectRoot"
}

Write-Host "Guvenlik duvarinda 3500 portu aciliyor..." -ForegroundColor Cyan
if (-not (Get-NetFirewallRule -DisplayName "VatanKepServer Dashboard" -ErrorAction SilentlyContinue)) {
  New-NetFirewallRule -DisplayName "VatanKepServer Dashboard" -Direction Inbound -Protocol TCP -LocalPort 3500 -Action Allow | Out-Null
}

Write-Host ""
Write-Host "Kurulum tamamlandi." -ForegroundColor Green
Write-Host "Servisler otomatik baslar ve bilgisayar yeniden baslasa/oturum kapansa da calismaya devam eder."
Write-Host "Durum kontrolu: Get-Service VatanKep-*"
Write-Host "Dashboard: http://localhost:3500"
