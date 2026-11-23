import { createServer } from 'vite'
import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const server = await createServer({ configFile: path.join(projectRoot, 'vite.config.ts'), server: { middlewareMode: true, watch: { ignored: ['**'] } }, appType: 'custom' })
try {
  const { buildWeekOneNarration } = await server.ssrLoadModule('/src/weekOneLessons.ts')
  const audioDir = path.join(projectRoot, 'public', 'audio')
  await mkdir(audioDir, { recursive: true })
  const names = { 2: 'business-ideas', 3: 'understanding-your-customer', 4: 'markets-and-competition', 5: 'how-businesses-make-money', 6: 'business-models', 7: 'weekly-review' }
  for (const [number, slug] of Object.entries(names)) {
    const filename = `day-${String(number).padStart(2, '0')}-${slug}-narration.txt`
    await writeFile(path.join(audioDir, filename), buildWeekOneNarration(Number(number)), 'utf8')
    process.stdout.write(`Prepared ${filename}\n`)
  }
} finally {
  await server.close()
}
