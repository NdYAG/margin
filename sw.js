self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('v1').then(cache => {
      return cache.addAll([
        '/margin',
        '/margin/index.html',
        '/margin/app.css',
        '/margin/app.js',
        '/margin/file.js'
      ])
    })
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response !== undefined) {
        return response
      } else {
        return fetch(event.request).then(response => {
          if (
            !response ||
            response.status !== 200 ||
            response.type !== 'basic'
          ) {
            return response
          }
          let responseClone = response.clone()

          caches.open('v1').then(cache => {
            cache.put(event.request, responseClone)
          })
          return response
        })
      }
    })
  )
})
