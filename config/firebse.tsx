import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
import { getMessaging, getToken, isSupported } from 'firebase/messaging'

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const secondary = initializeApp(firebaseConfig, 'secundary');
export const authsecond = getAuth(secondary);
export const auth = getAuth(app);
export const db = getFirestore(app)

// ── iOS helpers ───────────────────────────────────────────────────────────────

export function isIOS(): boolean {
    if (typeof navigator === 'undefined') return false
    return /iPad|iPhone|iPod/.test(navigator.userAgent)
}

export function isRunningAsPWA(): boolean {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(display-mode: standalone)').matches
        || (navigator as any).standalone === true  // Safari specific
}

// Returns true if iOS but NOT installed as PWA
export function isIOSBrowser(): boolean {
    return isIOS() && !isRunningAsPWA()
}

// ── Messaging ─────────────────────────────────────────────────────────────────

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
        // ── iOS: must be installed as PWA ────────────────────────────────────
        if (isIOS() && !isRunningAsPWA()) {
            console.log('iOS detected but not running as PWA — notifications unavailable')
            return { token: null, permission: null, requiresInstall: true }
        }

        const messaging = await getFirebaseMessaging()
        if (!messaging) return null

        if ('serviceWorker' in navigator) {
            await navigator.serviceWorker.register('/firebase-messaging-sw.js')
        }

        // ── iOS: permission must be triggered by user gesture ────────────────
        // (this function should only be called from a button onClick)
        const permission = await Notification.requestPermission()
        console.log('Permission:', permission)
        if (permission !== 'granted') return { token: null, permission }

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