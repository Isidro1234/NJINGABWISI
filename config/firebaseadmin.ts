// lib/firebaseAdmin.ts
import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import { getMessaging } from 'firebase-admin/messaging'
import serviceAccount from '../app/lib/service.json' with { type : "json"} 

const admin = initializeApp({
    credential: cert(serviceAccount as ServiceAccount)
})
export const adminDb = getFirestore(admin)
export const adminAuth = getAuth(admin)
export const adminMessaging = getMessaging(admin) 