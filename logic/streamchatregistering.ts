export const streamchat_client_frontend = async(username:string,id:string, image:string ,  isregistration:boolean)=>{
    const submit = await fetch(`http://localhost:3000/api/stream-chat`, 
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