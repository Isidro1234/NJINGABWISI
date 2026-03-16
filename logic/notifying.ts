export const notify_user_group = async(data:Array<object> | null)=>{
    if(!data) return;
    const res = await Promise.all ( data.map((item:any)=>{
        const fetchdata =  fetch(`https:n-jinga.vercel.app/api/notification`, {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({userId:item?.userId, url:item?.url, body:item?.description, title:item?.title, image:item?.image})
        }).then((res)=>{
            if(res.ok){
                return true
            }
            return 
        })
    }))
    return res   
}