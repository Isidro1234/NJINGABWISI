import { adminDb, adminMessaging } from '@/config/firebaseadmin'
import { NextResponse } from 'next/server'


export async function POST(request: Request) {
    try {
        const { userId, title, body, url , image } = await request.json()

      
        const tokenDoc = await adminDb
            .collection('fcm_tokens')
            .doc(userId)
            .get()

        if (!tokenDoc.exists) {
            return NextResponse.json({ error: 'Token not found' }, { status: 404 })
        }

        const { token } = tokenDoc.data()!

        await adminMessaging.send({
            token,
            notification: { title, body },
            webpush: {
                fcmOptions: { link: url || '/' },
                notification: {
                    title,
                    body,
                    icon: '/images/angola-flag-png.png',
                    image,
                }
            }
        })

        return NextResponse.json({ success: true })

    } catch (error: any) {
        console.log(error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}