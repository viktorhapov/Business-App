import { createServer } from 'vite'
import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const server = await createServer({ configFile: path.join(projectRoot, 'vite.config.ts'), optimizeDeps: { disabled: true }, server: { middlewareMode: true, watch: { ignored: ['**'] } }, appType: 'custom' })
try {
  const { buildWeekOneNarration } = await server.ssrLoadModule('/src/weekOneLessons.ts')
  const { buildDayOneNarration } = await server.ssrLoadModule('/src/lessonContent.ts')
  const audioDir = path.join(projectRoot, 'public', 'audio')
  await mkdir(audioDir, { recursive: true })
  const names = { 1: 'business-fundamentals', 2: 'business-ideas', 3: 'understanding-your-customer', 4: 'markets-and-competition', 5: 'how-businesses-make-money', 6: 'business-models', 7: 'weekly-review' }
  const requestedDay = process.argv[2] ? Number(process.argv[2]) : null
  if (requestedDay !== null && (!Number.isInteger(requestedDay) || !(requestedDay in names))) {
    throw new Error('Choose a lesson day from 1 to 7.')
  }
  const days = requestedDay === null ? [1, 2, 3, 4, 5, 6, 7] : [requestedDay]
  for (const day of days) {
    const slug = names[day]
    const number = String(day)
    const filename = `day-${String(number).padStart(2, '0')}-${slug}-narration.txt`
    const narration = day === 1 ? buildDayOneNarration() : buildWeekOneNarration(day)
    await writeFile(path.join(audioDir, filename), narration, 'utf8')
    process.stdout.write(`Prepared ${filename}\n`)
  }
} finally {
  await server.close()
}
