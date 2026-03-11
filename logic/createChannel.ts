export async function createChannel(client:any, currentId:any, otheruserID:any){
    const channel = client.channel('messaging', {
        members:[currentId , otheruserID]
    })
    await channel.create()
    return {channel}
}