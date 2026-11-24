import { existsSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const audioDir = path.join(root, 'public', 'audio', 'mp3')
const audioFiles = [
  'day-01-business-fundamentals.mp3',
  'day-02-business-ideas.mp3',
  'day-03-understanding-your-customer.mp3',
  'day-04-markets-and-competition.mp3',
  'day-05-how-businesses-make-money.mp3',
  'day-06-business-models.mp3',
  'day-07-weekly-review.mp3',
]

const missing = audioFiles.filter(name => !existsSync(path.join(audioDir, name)))
if (missing.length) {
  process.stderr.write(`Production build stopped: required lesson MP3 files are missing from public/audio/mp3:\n${missing.map(name => `  - ${name}`).join('\n')}\nRun scripts/convert-week-one-audio.ps1 before building.\n`)
  process.exit(1)
}

let totalBytes = 0
for (const name of audioFiles) {
  const size = statSync(path.join(audioDir, name)).size
  if (size <= 0) {
    process.stderr.write(`Production build stopped: ${name} is empty.\n`)
    process.exit(1)
  }
  totalBytes += size
}

process.stdout.write(`Production audio check passed: ${audioFiles.length} MP3 files (${(totalBytes / 1024 / 1024).toFixed(1)} MiB).\n`)
