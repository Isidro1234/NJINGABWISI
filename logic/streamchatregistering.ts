export const streamchat_client_frontend = async(username:string,id:string, image:string ,  
    isregistration:boolean)=>{
    const submit = await fetch(`https://n-jinga.vercel.app/api/stream-chat`, 
        {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({username, id , image, isregistration})
        })
    const token = await submit.json();
    if(token?.token){
        return token?.token;
    }
    return false
}