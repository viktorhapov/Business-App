param(
  [ValidateSet(1, 2, 3, 4, 5, 6, 7)]
  [int]$Day = 1,
  [string]$Voice = 'Microsoft David Desktop'
)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$audioDir = Join-Path $projectRoot 'public\audio'
$lessonSlugs = @{
  1 = 'business-fundamentals'
  2 = 'business-ideas'
  3 = 'understanding-your-customer'
  4 = 'markets-and-competition'
  5 = 'how-businesses-make-money'
  6 = 'business-models'
  7 = 'weekly-review'
}
$lessonSlug = $lessonSlugs[$Day]
$lessonPrefix = 'day-{0:D2}-{1}' -f $Day, $lessonSlug
$narrationPath = Join-Path $audioDir "$lessonPrefix-narration.txt"
$outputPath = Join-Path $audioDir "$lessonPrefix.wav"

if ($Day -ge 2) {
  & node (Join-Path $PSScriptRoot 'generate-week-one-narrations.mjs')
  if ($LASTEXITCODE -ne 0) { throw 'Could not prepare lesson narration text. Check that Node.js dependencies are installed.' }
}
if (-not (Test-Path -LiteralPath $narrationPath)) { throw "Narration script not found: $narrationPath" }

Add-Type -AssemblyName System.Speech
Add-Type -AssemblyName System.Security
$synth = [System.Speech.Synthesis.SpeechSynthesizer]::new()
try {
  $voiceName = $Voice
  try {
    $installedVoices = @($synth.GetInstalledVoices() | ForEach-Object { $_.VoiceInfo.Name })
  }
  catch {
    throw "Windows System.Speech could not enumerate installed voices in this session: $($_.Exception.Message)"
  }
  if ($installedVoices -notcontains $voiceName) {
    throw "Required local voice '$voiceName' is not installed. Available voices: $($installedVoices -join ', ')"
  }
  $synth.SelectVoice($voiceName)
  $synth.Rate = -1
  $synth.Volume = 100

  $scriptText = Get-Content -LiteralPath $narrationPath -Raw -Encoding UTF8
  $lines = $scriptText -split "`r?`n" | Where-Object {
    $_ -and
    $_ -notmatch '^BUSINESS LEARNING — DAY \d+:' -and
    $_ -notmatch '^Complete audio lesson narration script$' -and
    $_ -notmatch '^(INTRODUCTION|TERM \d+ — .+|FINAL REVIEW|CASE STUDY|FINAL QUIZ|CLOSING)$'
  }

  $ssmlLines = foreach ($line in $lines) {
    if ($line -match '^\[Pause for (\d+) seconds?\.\]$') {
      "<break time=`"$($Matches[1])s`"/>"
    } else {
      [System.Security.SecurityElement]::Escape($line)
    }
  }
  $lineBreak = '<break time="350ms"/>'
  $ssml = "<speak version=`"1.0`" xmlns=`"http://www.w3.org/2001/10/synthesis`" xml:lang=`"en-US`">$($ssmlLines -join $lineBreak)</speak>"

  if (Test-Path -LiteralPath $outputPath) {
    Remove-Item -LiteralPath $outputPath -Force
  }
  $synth.SetOutputToWaveFile($outputPath)
  $synth.SpeakSsml($ssml)
  $synth.SetOutputToNull()

  $file = Get-Item -LiteralPath $outputPath
  if ($file.Length -le 44) {
    Remove-Item -LiteralPath $outputPath -Force
    throw 'Speech engine produced an empty or invalid WAV file.'
  }
  Write-Output "Generated complete Day $Day narration: $($file.FullName) ($($file.Length) bytes)"
  Write-Output "Voice: $voiceName | Narration: $narrationPath"
}
finally {
  $synth.Dispose()
}
