export async function createChannel(
    client: any,
    currentId: string,
    otherUserId: string
) {
    if (!client?.userID) throw new Error('Stream client not connected')

    const res = await fetch('/api/stream-channel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentUserId: currentId, otherUserId })
    })

    if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to create channel')
    }

    const { channelId, channelType } = await res.json()

    // Client only watches — server already created it
    const channel = client.channel(channelType, channelId)
    await channel.watch()

    return { channel }
}