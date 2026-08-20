const CACHE_NAME = 'labenah-cache-v1';

// قائمة الملفات الأساسية التي سيتم حفظها في ذاكرة الجوال المؤقتة للعمل بدون إنترنت
const urlsToCache = [
  '/labenah-app/',
  '/labenah-app/index.html',
  '/labenah-app/manifest.json'
  // يمكنك إضافة أي ملفات CSS أو JavaScript إضافية هنا، مثلاً:
  // '/labenah-app/style.css',
  // '/labenah-app/script.js'
];

// 1. تثبيت وحفظ الملفات في ذاكرة التخزين المؤقت
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('تم فتح الكاش بنجاح');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. تفعيل الملف وحذف النسخ القديمة إن وجدت
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('حذف الكاش القديم:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 3. اعتراض الطلبات وتقديم الملفات المخزنة محلياً عند انقطاع الإنترنت
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إذا وجدنا الملف مخزناً، سنعيده فوراً، وإلا سنبحث عنه في الشبكة
        return response || fetch(event.request);
      })
  );
});