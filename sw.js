// Instalação do Service Worker e Cache de recursos
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open('omnitrix').then((cache) => {
            return cache.addAll([
                'index.html',
                'style.css',
                'app.js',
                'manifest.json',
                '192x192.png',
                '144x144.png',
                '512x512.png'
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