const filesToCache = [
  '/'
];

const staticCacheName = 'subatomo-ponds';

self.addEventListener('install', event => {
  console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(
    caches.open(staticCacheName)
    .then(cache => {
      return cache.addAll(filesToCache);
    })
  );
});


self.addEventListener('fetch', function(event) {
    var request = event.request;
    // console.log(request.url);
	//request.url.indexOf('https://fonts.gstatic.com/')
    if (true) {
      event.respondWith(
        caches.open('subatomo-ponds').then(function(cache) {
          return cache.match(event.request).then(function (response) {
            return response || fetch(event.request).then(function(response) {
              cache.put(event.request, response.clone());
              return response;
            });
          });
        })
      );
    }
});