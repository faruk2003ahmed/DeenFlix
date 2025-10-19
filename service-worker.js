const CACHE_NAME = 'deenflix-v17';
// যে ফাইলগুলো অফলাইনে ব্যবহারের জন্য সেভ করে রাখা হবে
const urlsToCache = [
  '/DeenFlix/',
  '/DeenFlix/index.html',
  '/DeenFlix/manifest.json',
  '/DeenFlix/icon-192x192.png',
  '/DeenFlix/icon-512x512.png'
];

// সার্ভিস ওয়ার্কার ইনস্টল করার সময় ফাইলগুলো ক্যাশ করা
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// পুরনো ক্যাশ পরিষ্কার করা
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// নেটওয়ার্ক অনুরোধ পেলে প্রথমে ক্যাশ থেকে ডেটা পরিবেশন করা
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // যদি ক্যাশে ফাইল পাওয়া যায়, তবে সেটি দেখানো হবে
        if (response) {
          return response;
        }
        // অন্যথায়, নেটওয়ার্ক থেকে আনা হবে
        return fetch(event.request);
      })
  );
});
