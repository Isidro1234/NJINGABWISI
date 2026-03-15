import { StreamChat } from 'stream-chat';
import { NextResponse } from 'next/server';

const serverClient = StreamChat.getInstance(
    `${process.env.STREAM_CHAT_KEY}`,
    `${process.env.STREAM_CHAT_SECRECT}`
);

export async function POST(request: Request) {
    try {
        const { currentUserId, otherUserId } = await request.json()

        if (!currentUserId || !otherUserId) {
            return NextResponse.json({ error: 'Missing user IDs' }, { status: 400 })
        }
        const channel = serverClient.channel('messaging', {
            members: [currentUserId, otherUserId],
            created_by_id: currentUserId,
        })

        await channel.create()

        return NextResponse.json({ channelId: channel.id, channelType: channel.type })

    } catch (error: any) {
        console.error('Stream channel error:', error.message)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}