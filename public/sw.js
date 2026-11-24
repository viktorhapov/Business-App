const CACHE_VERSION = 'business-learning-shell-v2'
const APP_ROOT = new URL('./', self.registration.scope).href
const BASE_PATH = new URL(APP_ROOT).pathname
const SHELL = [
  'manifest.webmanifest',
  'icons/app-icon.svg',
  'icons/app-icon-192.png',
  'icons/app-icon-512.png',
  'icons/apple-touch-icon.png',
].map(path => new URL(path, APP_ROOT).href)

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_VERSION)
    const page = await fetch(APP_ROOT)
    await cache.put(APP_ROOT, page.clone())
    const html = await page.text()
    const assets = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
      .map(match => match[1])
      .filter(url => url.startsWith(`${BASE_PATH}assets/`))
    await cache.addAll([...SHELL, ...assets])
    await self.skipWaiting()
  })())
})

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys()
    await Promise.all(names.filter(name => name.startsWith('business-learning-') && name !== CACHE_VERSION).map(name => caches.delete(name)))
    await self.clients.claim()
  })())
})

self.addEventListener('fetch', event => {
  const request = event.request
  const url = new URL(request.url)
  if (request.method !== 'GET' || url.origin !== self.location.origin || !url.pathname.startsWith(BASE_PATH)) return
  if (url.pathname.startsWith(`${BASE_PATH}audio/`)) return

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request)
        const cache = await caches.open(CACHE_VERSION)
        await cache.put(APP_ROOT, response.clone())
        return response
      } catch {
        return (await caches.match(APP_ROOT)) || Response.error()
      }
    })())
    return
  }

  if (url.pathname.startsWith(`${BASE_PATH}assets/`) || url.pathname.startsWith(`${BASE_PATH}icons/`) || url.pathname === `${BASE_PATH}manifest.webmanifest`) {
    event.respondWith((async () => {
      const cached = await caches.match(request)
      if (cached) return cached
      const response = await fetch(request)
      if (response.ok) await (await caches.open(CACHE_VERSION)).put(request, response.clone())
      return response
    })())
  }
})
