"use client"
import { getFirebaseMessaging, grantPermission, isIOSBrowser } from "@/config/firebse"
import { db } from "@/config/firebse"
import { decryptdata } from "@/logic/encryptdata"
import { Button, Text, VStack } from "@chakra-ui/react"
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
    const [showIOSBanner, setShowIOSBanner] = useState(false)

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

        let unsubscribe: any

        async function init() {
            const uip = localStorage.getItem('uip')
            const uipadmin = localStorage.getItem('uipadmin')

            let decryptedUser = null
            if (uip) {
                decryptedUser = decryptdata(uip)
            } else if (uipadmin) {
                decryptedUser = decryptdata(uipadmin)
            }

            setuserdata(decryptedUser)

            if (decryptedUser?.id) {
                const docref = doc(db, 'fcm_tokens', decryptedUser.id)
                const getting = await getDoc(docref)
                if (getting.exists()) {
                    setActivarNotif(true)
                }
            }

            const messaging = await getFirebaseMessaging()
            if (!messaging) return

            unsubscribe = onMessage(messaging, (payload) => {
                console.log('Foreground notification:', payload)

                // ── iOS does not support new Notification() in foreground ──
                // use the service worker instead
                if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.ready.then((reg) => {
                        reg.showNotification(payload.notification?.title || '', {
                            body: payload.notification?.body,
                            icon: payload.notification?.image || '/icons/notification.png',
                            badge: '/icons/icon-192x192.png',
                            data: { url: payload.fcmOptions?.link || '/' }
                        })
                    })
                } else {
                    // fallback for desktop
                    new Notification(payload.notification?.title || '', {
                        body: payload.notification?.body,
                        icon: payload.notification?.image || '/icons/notification.png',
                    })
                }
            })
        }

        init()

        return () => { if (unsubscribe) unsubscribe() }
    }, [])

    async function requestPermission(userId: string) {
        const result = await grantPermission()
        if (!result) return

        if (result?.requiresInstall) {
            setShowIOSBanner(true)
            return
        }

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

    const showButton = userdata && (!activarNotificacoes || permission !== 'granted')

    return (
        <NotificationContext.Provider value={{ permission, token, requestPermission }}>

            {userdata?.id && showButton && !showIOSBanner && (
                <Button
                    fontSize={12}
                    size='sm'
                    bg='blue'
                    onClick={() => requestPermission(userdata?.id)}
                >
                    Activar Notificações
                </Button>
            )}

            {/* ── iOS install banner ── */}
            {userdata?.id && showIOSBanner && (
                <VStack
                    padding={4}
                    bg='#1a1a2e'
                    borderRadius={10}
                    gap={2}
                    alignItems='flex-start'
                >
                    <Text fontSize={13} color='white' fontWeight={600}>
                        Activar Notificações no iPhone
                    </Text>
                    <Text fontSize={12} color='whiteAlpha.800'>
                        1. Clique no botao com tres pontinhos no canto inferior ridreito da sua tela
                    </Text>
                    <Text fontSize={12} color='whiteAlpha.800'>
                        2. Selecione a opcao partilhar (share)
                    </Text>
                    <Text fontSize={12} color='whiteAlpha.800'>
                        3. No menu que aparecer faca um scroll e selecione a opcao adicionar ao ecra inicial(add to home)
                    </Text>
                    <Text>4.Apos adicionar abra o app, faca login e active as notificacoes</Text>
                    <Button
                        fontSize={11}
                        size='xs'
                        variant='outline'
                        color='white'
                        borderColor='whiteAlpha.400'
                        onClick={() => setShowIOSBanner(false)}
                    >
                        Fechar
                    </Button>
                </VStack>
            )}

            {children}
        </NotificationContext.Provider>
    )
}

export const useNotificationContext = (): NotificationTypes => useContext(NotificationContext)