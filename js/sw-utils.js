const upateDynamicCache = (cacheName, request, response) => {
  if (response.ok) {
    caches.open(cacheName).then((cache) => {
      cache.put(request, response.clone());
    });
    return response.clone();
  } else {
    return response;
  }
};
