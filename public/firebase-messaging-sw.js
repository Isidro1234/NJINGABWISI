importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: "AIzaSyDsAIEVV-24AJ44D1OojJ42mNJYFQXWkfg",
  authDomain: "njinga-angola.firebaseapp.com",
  projectId: "njinga-angola",
  storageBucket: "njinga-angola.firebasestorage.app",
  messagingSenderId: "248477237286",
  appId: "1:248477237286:web:7533b53df05af0dd5f66e7",
  measurementId: "G-RP42QZJJ6R"
})



const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
    const { title, body, icon } = payload.notification

    self.registration.showNotification(title, {
        body,
        icon: icon || '/icons/notification.png',
        data: payload.data
    })
})
self.addEventListener('notificationclick', (event) => {
    event.notification.close()
    const url = event.notification.data?.url || '/'
    event.waitUntil(clients.openWindow(url))
})

