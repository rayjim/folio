# Folio startup script
# Serves notes.html from the folder this script lives in.
# Data files (notebooks.json, pages.json, state.json) are saved wherever
# you link inside the app (📁 button). Recommended: Documents\folio-data

$appDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start the local server in the background (hidden window)
Start-Process -FilePath "python" `
    -ArgumentList "-m http.server 8080 --directory `"$appDir`"" `
    -WindowStyle Hidden

# Brief pause to let the server come up
Start-Sleep -Seconds 1

# Open Folio in the default browser
Start-Process "http://localhost:8080/notes.html"
