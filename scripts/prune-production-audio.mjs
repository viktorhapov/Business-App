import { existsSync, rmSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const builtAudioDir = path.join(root, 'dist', 'audio')
const originalWavNames = [
  'day-01-business-fundamentals.wav',
  'day-02-business-ideas.wav',
  'day-03-understanding-your-customer.wav',
  'day-04-markets-and-competition.wav',
  'day-05-how-businesses-make-money.wav',
  'day-06-business-models.wav',
  'day-07-weekly-review.wav',
]

// Vite copies public/ verbatim. Remove only built WAV copies; the originals
// under public/audio remain untouched for local archival/source use.
for (const name of originalWavNames) {
  const builtCopy = path.join(builtAudioDir, name)
  if (existsSync(builtCopy)) rmSync(builtCopy)
}

process.stdout.write('Production output contains MP3 lesson audio; source WAV files were left untouched.\n')
