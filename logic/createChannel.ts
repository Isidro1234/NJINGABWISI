export async function createChannel(
  client: any,
  currentId: string,
  otheruserID: string
) {

  if (!client?.userID) {

    throw new Error("Stream client not connected")
    
  }

  const channel = client.channel("messaging", {
    members: [currentId, otheruserID],
  })

  await channel.create()

  return { channel }
}