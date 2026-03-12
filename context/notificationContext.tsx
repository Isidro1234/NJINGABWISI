"use client"
import { getFirebaseMessaging, grantPermission } from "@/config/firebse"
import { db } from "@/config/firebse"
import { decryptdata } from "@/logic/encryptdata"
import { Button } from "@chakra-ui/react"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { onMessage } from "firebase/messaging"
import { createContext, useContext, useEffect, useState } from "react"

interface NotificationTypes {
    permission: NotificationPermission | null
    token: string | null
    requestPermission: (userId: string) => Promise<void>
}

const NotificationContext = createContext<NotificationTypes>({
    permission: null,
    token: null,
    requestPermission: async () => {}
})

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [permission, setPermission] = useState<NotificationPermission | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [userdata, setuserdata] = useState<any>(null)
    const [activarNotificacoes, setActivarNotif] = useState(false)

    useEffect(() => {
    // ✅ Always register SW and check permission — regardless of login state
    if (typeof window !== 'undefined' && 'Notification' in window) {
        setPermission(Notification.permission)
    }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('/firebase-messaging-sw.js')
            .then((reg) => console.log('SW registered:', reg))
            .catch((err) => console.error('SW error:', err))
    }

    let unsubscribe: any

    async function init() {
        const uip = localStorage.getItem('uip')
        const uipadmin = localStorage.getItem('uipadmin')

        // ✅ Decrypt user
        let decryptedUser = null
        if (uip) {
            decryptedUser = decryptdata(uip)
        } else if (uipadmin) {
            decryptedUser = decryptdata(uipadmin)
        }

        // ✅ Always set userdata — even if null
        setuserdata(decryptedUser)

        // ✅ Check if token already exists
        if (decryptedUser?.id) {
            const docref = doc(db, 'fcm_tokens', decryptedUser.id)
            const getting = await getDoc(docref)
            if (getting.exists()) {
                setActivarNotif(true)
            }
        }

        // ✅ Listen for messages
        const messaging = await getFirebaseMessaging()
        if (!messaging) return

        unsubscribe = onMessage(messaging, (payload) => {
            console.log('Foreground notification:', payload)
            new Notification(payload.notification?.title || '', {
                body: payload.notification?.body,
                icon: payload.notification?.image || '/icons/notification.png',
            })
        })
    }

    init()

    return () => { if (unsubscribe) unsubscribe() }
}, [])

// ✅ Fixed condition

    async function requestPermission(userId: string) {
        const result = await grantPermission()
        if (!result) return
        setPermission(result.permission as NotificationPermission)
        setToken(result.token)
        setActivarNotif(true)
        if (result.token && userId) {
            await setDoc(doc(db, 'fcm_tokens', userId), {
                token: result.token,
                userId,
                updatedAt: new Date()
            }, { merge: true })
        }
    }

    // ✅ Clear condition — show button only when:
    // 1. User is logged in
    // 2. Notifications not yet activated
    // 3. Permission not yet granted
    const showButton = userdata && (!activarNotificacoes || permission !== 'granted')

    return (
        <NotificationContext.Provider value={{ permission, token, requestPermission }}>
            {showButton && (
                <Button
                    fontSize={12}
                    size='sm'
                    bg='blue'
                    onClick={() => requestPermission(userdata?.id)}
                >
                    Activar Notificações
                </Button>
            )}
            {children}
        </NotificationContext.Provider>
    )
}

export const useNotificationContext = (): NotificationTypes => useContext(NotificationContext)