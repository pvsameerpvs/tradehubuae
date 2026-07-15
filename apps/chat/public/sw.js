const CACHE_NAME = "tradehub-chat-v1";
const APP_SHELL = [
  "/",
  "/chats",
  "/offline",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("/offline"))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((response) => {
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});

self.addEventListener("push", (event) => {
  const data = event.data.json();

  const options = {
    title: data.sender || "New Message",
    body: data.message || "",
    icon: "/icons/logo-mob.png",
    badge: "/icons/badge-icon.png",
    tag: `session-${data.sessionId}`,
    renotify: true,
    vibrate: [200, 100, 200],
    data: {
      sessionId: data.sessionId,
      url: `/chats/${data.sessionId}`,
    },
    actions: [
      { action: "open", title: "Open Chat" },
    ],
    requireInteraction: true,
    silent: false,
  };

  event.waitUntil(
    self.registration.showNotification(options.title, options)
  );

  if (data.unreadCount && navigator.setAppBadge) {
    navigator.setAppBadge(data.unreadCount);
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "open" || !event.action) {
    const urlToOpen = event.notification.data.url;
    event.waitUntil(
      clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
        for (const client of windowClients) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.navigate(urlToOpen);
            return client.focus();
          }
        }
        return clients.openWindow(urlToOpen);
      })
    );
  }
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "CLEAR_BADGE") {
    if (navigator.clearAppBadge) {
      navigator.clearAppBadge();
    }
  }
});
