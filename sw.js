importScripts("js/sw-utils.js");

const STATIC_CACHE = "static_cache_v4";
const DYNAMIC_CACHE = "dynamic_cache_v2";
const INMUTABLE_CACHE = "inmutable_cache";

const APP_SHELL = [
  //"/",
  "js/app.js",
  "index.html",
  "css/style.css",
  "img/favicon.ico",
  "img/avatars/spiderman.jpg",
  "img/avatars/ironman.jpg",
  "img/avatars/thor.jpg",
  "img/avatars/wolverine.jpg",
  "img/avatars/hulk.jpg",
];

const APP_SHELL_INMUTABLE = [
  "https://fonts.googleapis.com/css?family=Quicksand:300,400",
  "https://fonts.googleapis.com/css?family=Quicksand:300,400",
  "https://fonts.googleapis.com/css?family=Lato:400,300",
  "css/animate.css",
  "js/libs/jquery.js",
  "js/sw-utils.js",
];

self.addEventListener("install", (e) => {
  const staticCache = caches.open(STATIC_CACHE).then((cache) => {
    cache.addAll(APP_SHELL);
  });
  const inmutableCache = caches.open(INMUTABLE_CACHE).then((cache) => {
    cache.addAll(APP_SHELL_INMUTABLE);
  });

  e.waitUntil(Promise.all([staticCache, inmutableCache]));
});

self.addEventListener("activate", (e) => {
  const response = caches.keys().then((keys) => {
    keys.forEach((key) => {
      if (key !== STATIC_CACHE && key.includes("static")) {
        return caches.delete(key);
      }

      if (key !== DYNAMIC_CACHE && key.includes("dynamic")) {
        return caches.delete(key);
      }
    });
  });

  e.waitUntil(response);
});

self.addEventListener("fetch", (e) => {
  const reponse = caches.match(e.request).then((response) => {
    if (response) {
      return response;
    } else {
      return fetch(e.request).then((newResponse) => {
        return upateDynamicCache(DYNAMIC_CACHE, e.request, newResponse);
      });
    }
  });
  e.respondWith(reponse);
});
