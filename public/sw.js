const CACHE_VERSION = 'business-learning-shell-v1'
const SHELL = ['/manifest.webmanifest', '/icons/app-icon.svg', '/icons/app-icon-192.png', '/icons/app-icon-512.png', '/icons/apple-touch-icon.png']

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_VERSION)
    const page = await fetch('/')
    await cache.put('/', page.clone())
    const html = await page.text()
    const assets = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
      .map(match => match[1])
      .filter(url => url.startsWith('/assets/'))
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
  if (request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/audio/')) return

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request)
        const cache = await caches.open(CACHE_VERSION)
        await cache.put('/', response.clone())
        return response
      } catch {
        return (await caches.match('/')) || Response.error()
      }
    })())
    return
  }

  if (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/icons/') || url.pathname === '/manifest.webmanifest') {
    event.respondWith((async () => {
      const cached = await caches.match(request)
      if (cached) return cached
      const response = await fetch(request)
      if (response.ok) await (await caches.open(CACHE_VERSION)).put(request, response.clone())
      return response
    })())
  }
})
