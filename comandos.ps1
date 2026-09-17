param([string]$accion = "help")

switch ($accion) {
    "up"      { docker compose up -d --build }
    "down"    { docker compose down }
    "logs"    { docker compose logs -f }
    "ps"      { docker compose ps }
    "test"    {
        curl.exe -s http://localhost:3000/health
        Write-Host ""
        curl.exe -s http://localhost:3000/usuarios
    }
    "clean"   { docker compose down -v }
    default   { Write-Host "Uso: .\comandos.ps1 [up|down|logs|ps|test|clean]" }
}