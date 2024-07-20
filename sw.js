// Instalação do Service Worker e Cache de recursos
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open('omnitrix').then((cache) => {
            return cache.addAll([
                'index.html',
                'style.css',
                'app.js',
                'manifest.json',
                'imgs/sino-48.ico',
                'imgs/sino-144.png',
                'imgs/sino-192.png',
                'imgs/sino-512.png'
            ]);
        })
    );
});

// Intercepta solicitações de rede e serve os recursos do cache, se disponíveis
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});
