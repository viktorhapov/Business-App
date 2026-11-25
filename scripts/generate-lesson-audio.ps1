param(
  [ValidateSet(1, 2, 3, 4, 5, 6, 7)]
  [int]$Day = 1,
  [string]$EnglishVoice = 'Microsoft Zira Desktop'
)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$audioDir = Join-Path $projectRoot 'public\audio'
$mp3Dir = Join-Path $audioDir 'mp3'
$lessonSlugs = @{
  1 = 'business-fundamentals'
  2 = 'business-ideas'
  3 = 'understanding-your-customer'
  4 = 'markets-and-competition'
  5 = 'how-businesses-make-money'
  6 = 'business-models'
  7 = 'weekly-review'
}
$lessonPrefix = 'day-{0:D2}-{1}' -f $Day, $lessonSlugs[$Day]
$narrationPath = Join-Path $audioDir "$lessonPrefix-narration.txt"
$wavPath = Join-Path $audioDir "$lessonPrefix.wav"
$mp3Path = Join-Path $mp3Dir "$lessonPrefix.mp3"
$temporaryWavPath = "$wavPath.tmp.wav"
$temporaryMp3Path = "$mp3Path.tmp.mp3"

# Refresh this lesson's script only. The Day 1 command does not touch Days 2–7 audio.
& node (Join-Path $PSScriptRoot 'generate-week-one-narrations.mjs') $Day
if ($LASTEXITCODE -ne 0) { throw "Could not prepare Day $Day narration text." }
if (-not (Test-Path -LiteralPath $narrationPath)) { throw "Narration script not found: $narrationPath" }

$installedPathEntries = @($env:PATH -split ';')
$installedPathEntries += (Get-ItemProperty 'HKCU:\Environment' -ErrorAction SilentlyContinue).Path -split ';'
$installedPathEntries += (Get-ItemProperty 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Environment' -ErrorAction SilentlyContinue).Path -split ';'
$ffmpeg = (Get-Command 'ffmpeg.exe' -ErrorAction SilentlyContinue | Select-Object -First 1).Source
if (-not $ffmpeg) {
  foreach ($entry in ($installedPathEntries | Where-Object { $_ } | Select-Object -Unique)) {
    $candidate = Join-Path ([Environment]::ExpandEnvironmentVariables($entry.Trim())) 'ffmpeg.exe'
    if (Test-Path -LiteralPath $candidate -PathType Leaf) { $ffmpeg = $candidate; break }
  }
}
if (-not $ffmpeg) {
  $wingetPackages = Join-Path $env:LOCALAPPDATA 'Microsoft\WinGet\Packages'
  if (Test-Path -LiteralPath $wingetPackages) {
    $ffmpeg = Get-ChildItem -LiteralPath $wingetPackages -Directory -Filter 'Gyan.FFmpeg_*' -ErrorAction SilentlyContinue |
      ForEach-Object { Get-ChildItem -LiteralPath $_.FullName -Filter 'ffmpeg.exe' -File -Recurse -ErrorAction SilentlyContinue } |
      Select-Object -First 1 -ExpandProperty FullName
  }
}
if (-not $ffmpeg) { throw 'FFmpeg is required to create the iPhone-friendly MP3. No software was installed.' }

Add-Type -AssemblyName System.Speech
Add-Type -AssemblyName System.Security
$synth = [System.Speech.Synthesis.SpeechSynthesizer]::new()
try {
  $voices = @($synth.GetInstalledVoices() | Where-Object { $_.Enabled } | ForEach-Object { $_.VoiceInfo })
  $voice = $voices | Where-Object { $_.Name -eq $EnglishVoice -and $_.Culture.Name -like 'en-*' } | Select-Object -First 1
  if (-not $voice) {
    $available = ($voices | ForEach-Object { "$($_.Name) [$($_.Culture.Name)]" }) -join ', '
    throw "English voice '$EnglishVoice' is not available to System.Speech. Available voices: $available"
  }
  $synth.SelectVoice($voice.Name)

  $scriptText = Get-Content -LiteralPath $narrationPath -Raw -Encoding UTF8
  if ([regex]::IsMatch($scriptText, '\p{IsCyrillic}')) {
    throw 'Russian text was found in the audio narration. Refusing to send it to an English voice.'
  }

  $ssmlSegments = New-Object 'System.Collections.Generic.List[string]'
  $englishCount = 0
  $termCount = 0
  foreach ($rawLine in ($scriptText -split "`r?`n")) {
    $line = $rawLine.Trim()
    if (-not $line) { continue }
    if ($line -match '^(BUSINESS LEARNING — DAY \d+:.*|Complete audio lesson narration script|INTRODUCTION|TERM \d+ — .+|FINAL REVIEW|CLOSING|CASE STUDY|LISTENING COMPREHENSION|VOCABULARY RECALL.*|FINAL REVIEW QUIZ)$') {
      if ($line -match '^TERM \d+ — ') { $termCount++ }
      continue
    }
    if ($line -match '^\[EN\]\s+(.+)$') {
      $ssmlSegments.Add([System.Security.SecurityElement]::Escape($Matches[1]))
      $englishCount++
      continue
    }
    if ($line -match '^\[PAUSE:(\d+)\]$') {
      $ssmlSegments.Add("<break time=`"$($Matches[1])s`"/>")
      continue
    }
    if ($line -match '^\[RU\]') { throw 'Russian sections are not allowed in English-only audio narration.' }
    throw "Unmarked narration line; refusing to send it to TTS: '$line'"
  }
  if ($englishCount -eq 0) { throw 'Narration has no English speech.' }
  if ($Day -eq 1 -and $termCount -ne 10) { throw "Day 1 narration has $termCount term headings; expected 10." }

  $ssml = "<speak version=`"1.0`" xmlns=`"http://www.w3.org/2001/10/synthesis`" xml:lang=`"$($voice.Culture.Name)`">$($ssmlSegments -join '<break time="350ms"/>')</speak>"
  if (Test-Path -LiteralPath $temporaryWavPath) { Remove-Item -LiteralPath $temporaryWavPath -Force }
  if (Test-Path -LiteralPath $temporaryMp3Path) { Remove-Item -LiteralPath $temporaryMp3Path -Force }

  $synth.SetOutputToWaveFile($temporaryWavPath)
  $synth.SpeakSsml($ssml)
  $synth.SetOutputToNull()
  $wav = Get-Item -LiteralPath $temporaryWavPath
  if ($wav.Length -le 44) { throw 'Speech engine produced an empty or invalid WAV file.' }

  & $ffmpeg -hide_banner -loglevel error -y -i $temporaryWavPath -map 0:a:0 -vn -c:a libmp3lame -b:a 128k -ac 1 -ar 22050 $temporaryMp3Path
  if ($LASTEXITCODE -ne 0) { throw "FFmpeg MP3 conversion failed (exit code $LASTEXITCODE)." }
  if (-not (Test-Path -LiteralPath $temporaryMp3Path) -or (Get-Item -LiteralPath $temporaryMp3Path).Length -le 0) { throw 'FFmpeg did not create a non-empty MP3.' }
  & $ffmpeg -hide_banner -v error -i $temporaryMp3Path -map 0:a:0 -f null NUL
  if ($LASTEXITCODE -ne 0) { throw 'Generated MP3 failed full decode verification.' }

  New-Item -ItemType Directory -Path $mp3Dir -Force | Out-Null
  Move-Item -LiteralPath $temporaryWavPath -Destination $wavPath -Force
  Move-Item -LiteralPath $temporaryMp3Path -Destination $mp3Path -Force
  Write-Output "Generated Day $Day English audio WAV: $wavPath"
  Write-Output "Generated and decoded MP3: $mp3Path"
  Write-Output "Voice: $($voice.Name) [$($voice.Culture.Name)]"
  Write-Output 'MP3 format: 128 kbps, mono, 22.05 kHz'
}
catch {
  if (Test-Path -LiteralPath $temporaryWavPath) { Remove-Item -LiteralPath $temporaryWavPath -Force }
  if (Test-Path -LiteralPath $temporaryMp3Path) { Remove-Item -LiteralPath $temporaryMp3Path -Force }
  throw
}
finally {
  $synth.Dispose()
}
