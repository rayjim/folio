# Folio startup script
# Default location: Documents\folio
# To use a different folder, change $folioDir below.

$folioDir = Join-Path ([Environment]::GetFolderPath('MyDocuments')) 'folio'

# Ensure the folio folder exists
if (-not (Test-Path $folioDir)) {
    New-Item -ItemType Directory -Path $folioDir | Out-Null
}

# Copy notes.html into the folio folder if it isn't there yet
$notesFile = Join-Path $folioDir 'notes.html'
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$source    = Join-Path $scriptDir 'notes.html'
if (-not (Test-Path $notesFile)) {
    Copy-Item $source $notesFile
}

# Start the local server in the background (hidden window)
Start-Process -FilePath "python" `
    -ArgumentList "-m http.server 8080 --directory `"$folioDir`"" `
    -WindowStyle Hidden

# Brief pause to let the server come up
Start-Sleep -Seconds 1

# Open Folio in the default browser
Start-Process "http://localhost:8080/notes.html"
