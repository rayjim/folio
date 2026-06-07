; Folio — Inno Setup installer script
[Setup]
AppName=Folio
AppVersion=1.0.0
AppPublisher=Folio
DefaultDirName={autopf}\Folio
DefaultGroupName=Folio
OutputDir=dist
OutputBaseFilename=Folio-Setup-1.0.0
Compression=lzma
SolidCompression=yes
ArchitecturesInstallIn64BitMode=x64compatible
DisableProgramGroupPage=yes
UninstallDisplayIcon={app}\Folio.exe

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Files]
Source: "dist\win-unpacked\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs

[Icons]
Name: "{autoprograms}\Folio"; Filename: "{app}\Folio.exe"
Name: "{autodesktop}\Folio"; Filename: "{app}\Folio.exe"; Tasks: desktopicon

[Tasks]
Name: "desktopicon"; Description: "Create a desktop shortcut"; GroupDescription: "Additional icons:"

[Run]
Filename: "{app}\Folio.exe"; Description: "Launch Folio"; Flags: nowait postinstall skipifsilent
