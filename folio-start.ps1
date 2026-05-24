# Folio startup script
# Serves notes.html from the folder this script lives in.
# Data files (notebooks.json, pages.json, state.json) are saved to the
# folder you link inside the app (📁 button).
#
# Default data folder: C:\Users\user\OneDrive\Pictures\ドキュメント\folio
# Link it once via the 📁 button — Folio remembers it across sessions.

$appDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Ensure the default data folder exists so it is ready to link in the app
$dataDir = "C:\Users\user\OneDrive\Pictures\ドキュメント\folio"
if (-not (Test-Path $dataDir)) {
    New-Item -ItemType Directory -Path $dataDir | Out-Null
}

# Start the local server in the background (hidden window)
Start-Process -FilePath "python" `
    -ArgumentList "-m http.server 8080 --directory `"$appDir`"" `
    -WindowStyle Hidden

# Brief pause to let the server come up
Start-Sleep -Seconds 1

# Open Folio in the default browser
Start-Process "http://localhost:8080/notes.html"
