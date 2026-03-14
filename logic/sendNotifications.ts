export const notification_send = async({userId, title, body, url , image }:{
    body:string, image:string, userId:string, title:string, url:string
})=>{
    const sendNotification = await fetch(`http://localhost:3000/api/notification`,{
        method:'POST',
        headers:{
            "Content-Type":'application/json'
        },
        body:JSON.stringify({userId, title, body, url , image })

    })
    if(sendNotification.ok){
        return true
    }else{
        return false
    }
}