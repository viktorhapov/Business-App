$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$audioDir = Join-Path $projectRoot 'public\audio'
$outputDir = Join-Path $audioDir 'mp3'
$lessons = @(
  'day-01-business-fundamentals',
  'day-02-business-ideas',
  'day-03-understanding-your-customer',
  'day-04-markets-and-competition',
  'day-05-how-businesses-make-money',
  'day-06-business-models',
  'day-07-weekly-review'
)

# An installer may have updated the registered PATH after this PowerShell
# session started. Search both the current PATH and the saved Windows PATH.
$pathEntries = @($env:PATH -split ';')
$pathEntries += (Get-ItemProperty 'HKCU:\Environment' -ErrorAction SilentlyContinue).Path -split ';'
$pathEntries += (Get-ItemProperty 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Environment' -ErrorAction SilentlyContinue).Path -split ';'
$ffmpeg = (Get-Command 'ffmpeg.exe' -ErrorAction SilentlyContinue | Select-Object -First 1).Source
if (-not $ffmpeg) {
  foreach ($entry in ($pathEntries | Where-Object { $_ } | Select-Object -Unique)) {
    $expandedEntry = [Environment]::ExpandEnvironmentVariables($entry.Trim())
    $candidate = Join-Path $expandedEntry 'ffmpeg.exe'
    if (Test-Path -LiteralPath $candidate -PathType Leaf) {
      $ffmpeg = $candidate
      break
    }
  }
}
if (-not $ffmpeg) {
  throw 'FFmpeg was not found in the current or registered Windows PATH. Install is not attempted.'
}

$sourceFiles = foreach ($lesson in $lessons) {
  $path = Join-Path $audioDir ($lesson + '.wav')
  if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
    throw "Required source WAV is missing: $path"
  }
  $file = Get-Item -LiteralPath $path
  $stream = [System.IO.File]::OpenRead($path)
  try {
    $header = New-Object byte[] 12
    if ($stream.Read($header, 0, $header.Length) -ne $header.Length -or
        [System.Text.Encoding]::ASCII.GetString($header, 0, 4) -ne 'RIFF' -or
        [System.Text.Encoding]::ASCII.GetString($header, 8, 4) -ne 'WAVE') {
      throw "Source is not a valid RIFF/WAVE file: $path"
    }
  }
  finally {
    $stream.Dispose()
  }
  $file
}

$sourceSnapshots = @{}
foreach ($file in $sourceFiles) {
  $sourceSnapshots[$file.FullName] = [pscustomobject]@{
    Length = $file.Length
    LastWriteTimeUtc = $file.LastWriteTimeUtc
  }
}
$originalBytes = ($sourceFiles | Measure-Object -Property Length -Sum).Sum
$null = New-Item -ItemType Directory -Path $outputDir -Force

foreach ($source in $sourceFiles) {
  $destination = Join-Path $outputDir (([IO.Path]::GetFileNameWithoutExtension($source.Name)) + '.mp3')
  & $ffmpeg -hide_banner -loglevel error -y -i $source.FullName -map 0:a:0 -vn -sn -dn -c:a libmp3lame -b:a 128k -ac 1 -ar 22050 $destination
  if ($LASTEXITCODE -ne 0) {
    throw "FFmpeg failed converting '$($source.Name)' (exit code $LASTEXITCODE)."
  }
}

$mp3Files = @()
foreach ($lesson in $lessons) {
  $path = Join-Path $outputDir ($lesson + '.mp3')
  if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
    throw "Converted MP3 is missing: $path"
  }
  $file = Get-Item -LiteralPath $path
  if ($file.Length -le 0) { throw "Converted MP3 is empty: $path" }

  # Decode each result fully so success means the MP3 stream is readable.
  & $ffmpeg -hide_banner -v error -i $path -map 0:a:0 -f null NUL
  if ($LASTEXITCODE -ne 0) {
    throw "MP3 playback/decode verification failed: $path (exit code $LASTEXITCODE)."
  }
  $mp3Files += $file
}

foreach ($source in $sourceFiles) {
  $after = Get-Item -LiteralPath $source.FullName
  $before = $sourceSnapshots[$source.FullName]
  if ($after.Length -ne $before.Length -or $after.LastWriteTimeUtc -ne $before.LastWriteTimeUtc) {
    throw "Original WAV changed during conversion: $($source.FullName)"
  }
}

if ($mp3Files.Count -ne 7) { throw "Expected 7 MP3 files, found $($mp3Files.Count)." }
$mp3Bytes = ($mp3Files | Measure-Object -Property Length -Sum).Sum
$ratio = [math]::Round($originalBytes / [double]$mp3Bytes, 2)
$reduction = [math]::Round((1 - ($mp3Bytes / [double]$originalBytes)) * 100, 1)
Write-Output ("Verified playable MP3 files: {0}/7" -f $mp3Files.Count)
Write-Output ("Settings: 128 kbps, mono, 22.05 kHz (libmp3lame)")
Write-Output ("Original WAV total: {0:N2} MB ({1:N2} MiB)" -f ($originalBytes / 1000000), ($originalBytes / 1MB))
Write-Output ("Converted MP3 total: {0:N2} MB ({1:N2} MiB)" -f ($mp3Bytes / 1000000), ($mp3Bytes / 1MB))
Write-Output ("Compression ratio: {0}:1; size reduction: {1}%" -f $ratio, $reduction)
Write-Output "MP3 output folder: $outputDir"
