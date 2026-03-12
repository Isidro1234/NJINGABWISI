// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore'
import {getMessaging, getToken, isSupported} from 'firebase/messaging'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const secondary = initializeApp(firebaseConfig, 'secundary');
export const authsecond = getAuth(secondary);
export const auth = getAuth(app);
export const db = getFirestore(app)

export async function getFirebaseMessaging() {
    try {
        const supported = await isSupported()
        if (!supported) return null
        return getMessaging(app)
    } catch (error) {
        console.error('Messaging not supported:', error)
        return null
    }
}
export async function grantPermission() {
    try {
        // ✅ Check support
        const messaging = await getFirebaseMessaging()
        if (!messaging) return null

        // ✅ Register service worker first
        if ('serviceWorker' in navigator) {
            await navigator.serviceWorker.register('/firebase-messaging-sw.js')
        }

        // ✅ Request permission
        const permission = await Notification.requestPermission()
        console.log('Permission:', permission)
        if (permission !== 'granted') return null

        // ✅ Get token
        const token = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
            serviceWorkerRegistration: await navigator.serviceWorker.ready
        })

        console.log('FCM Token:', token)
        return { token, permission }

    } catch (error) {
        console.error('grantPermission error:', error)
        return null
    }
}