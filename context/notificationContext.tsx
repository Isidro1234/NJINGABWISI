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
        if (typeof window !== 'undefined' && 'Notification' in window) {
            setPermission(Notification.permission)
        }

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/firebase-messaging-sw.js')
                .then((reg) => console.log('SW registered:', reg))
                .catch((err) => console.error('SW error:', err))
        }

        // ✅ Get user data synchronously and pass directly — don't rely on state
        const uip = localStorage.getItem('uip')
        const uipadmin = localStorage.getItem('uipadmin')
        if(!uip && !uipadmin) return;
        let decryptedUser = null
        if (uip) {
            decryptedUser = decryptdata(uip)
        } else if (uipadmin) {
            decryptedUser = decryptdata(uipadmin)
        }

        // ✅ Set state for UI
        if (decryptedUser) setuserdata(decryptedUser)

        // ✅ Pass directly to gt() — don't use state here
        async function gt(user: any) {
            if (!user?.id) return  // ✅ guard against null
            const docref = doc(db, 'fcm_tokens', user.id)
            const getting = await getDoc(docref)
            if (getting.exists()) {
                setActivarNotif(true)
            }
        }

        let unsubscribe: any
        async function listenForMessages() {
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

        listenForMessages()
        gt(decryptedUser)  // ✅ pass directly

        return () => { if (unsubscribe) unsubscribe() }
    }, [])

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

    return (
        <NotificationContext.Provider value={{ permission, token, requestPermission }}>
            {(!activarNotificacoes || permission !== 'granted' && !userdata) && (
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