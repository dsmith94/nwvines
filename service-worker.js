'use strict';

var cacheVersion = 1;
var currentCache = {
  offline: 'offline-cache' + cacheVersion
};
const offlineUrl = 'https://dsmith94.github.io/nwvines/offline.html';

this.addEventListener('install', event => {
  event.waitUntil(
    caches.open(currentCache.offline).then(function(cache) {
      return cache.addAll([
          'https://dsmith94.github.io/nwvines/glass-of-red-vine.jpg',
          offlineUrl
      ]);
    })
  );
});


this.addEventListener('fetch', event => {
  console.log('check fetch ');
  // request.mode = navigate isn't supported in all browsers
  // so include a check for Accept: text/html header.
  //if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
  if (event.request.mode === 'navigate') {
        event.respondWith(
          fetch(event.request.url).catch(error => {
              // Return the offline page
              console.log('check here');
              return caches.match(offlineUrl);
          })
    );
  }
  else{
        // Respond with everything else if we can
        event.respondWith(caches.match(event.request)
                        .then(function (response) {
                        return response || fetch(event.request);
                    })
            );
      }
});

