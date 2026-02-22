// firebase-messaging-sw.js
// This file runs in the background of the phone to catch notifications when the app is closed.

// We import the Firebase background scripts directly from Google
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// ==========================================
// ⚠️ PASTE YOUR FIREBASE CONFIG HERE ⚠️
// It must be the exact same one you use in index.html
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyCiF_rlhJO8TO3RJ2G4OaG9SOZoGgPpvhk",
    authDomain: "dignex-88f5b.firebaseapp.com",
    projectId: "dignex-88f5b",
    storageBucket: "dignex-88f5b.firebasestorage.app",
    messagingSenderId: "1039498013474",
    appId: "1:1039498013474:web:2299eefcfc750de54f537b"
};


// Initialize the background app
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// This function fires when a notification hits the phone while the app is CLOSED
messaging.onBackgroundMessage((payload) => {
    console.log('[Background Worker] Received message: ', payload);
    
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Black_check.svg/512px-Black_check.svg.png', // Your PWA icon
        badge: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Black_check.svg/512px-Black_check.svg.png'
    };

    // This command tells Android/iOS to physically buzz and show the lock-screen banner
    self.registration.showNotification(notificationTitle, notificationOptions);
});