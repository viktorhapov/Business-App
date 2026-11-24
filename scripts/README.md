# Generate Week 1 lesson audio locally

The lesson transcripts for Days 2–7 are generated from the app's lesson data. The PowerShell command below prepares them when needed, then uses Windows `System.Speech` and the Microsoft David Desktop voice to create one complete WAV for the selected day.

From a Windows PowerShell terminal at the project root:

```powershell
.\scripts\generate-lesson-audio.ps1 -Day 2
.\scripts\generate-lesson-audio.ps1 -Day 3
.\scripts\generate-lesson-audio.ps1 -Day 4
.\scripts\generate-lesson-audio.ps1 -Day 5
.\scripts\generate-lesson-audio.ps1 -Day 6
.\scripts\generate-lesson-audio.ps1 -Day 7
```

The narration generator saves WAV source files in `public/audio/`; the lesson player uses the compressed MP3 files in `public/audio/mp3/`. Each narration has a five-second pause at question cues. No cloud service or added package is used. The script checks for David and stops without writing an audio file if that voice is unavailable in the current Windows session. After creating or refreshing WAVs, convert the week with the installed FFmpeg:

```powershell
.\scripts\convert-week-one-audio.ps1
```

To prepare or refresh all Day 2–7 narration transcripts without creating audio:

```powershell
node .\scripts\generate-week-one-narrations.mjs
```

Day 1's existing transcript and WAV are preserved. The converter also leaves all WAV source files unchanged.
