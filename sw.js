/* SYNTHIOSIS hub — offline shell. Law Eight: the record opens with or without a network. */
const CACHE = 'synthiosis-hub-v12';
const CORE = ['./', './index.html', './manifest.json', './icon.svg'];
const EXTRAS = ['./logo.png', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => e.waitUntil(
  caches.open(CACHE).then(c => c.addAll(CORE).then(() =>
    Promise.all(EXTRAS.map(u => c.add(u).catch(() => {}))))).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request).then(h => h || caches.match('./index.html'))));
});
