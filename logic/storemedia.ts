export const store = async ({image,name,type}:{image: any, name: string, type: string})=>{
    try {
            const url = 
            `https://njinga-worker.njinga.workers.dev/${encodeURIComponent(name)}`
            const res =  await fetch(url,{
                method:"PUT",
                body:image,
                headers:{
                    'Content-Type' : type
                }
            })
            if(res.ok){
                return url
            }else{
                return false
            }
    } catch (error:any) {
        console.log(error.message)
    }
    
}

export const deletestore = async (name:any)=>{
    try {
            const url = `https://njinga-worker.njinga.workers.dev/${encodeURIComponent(name)}`
            const res =  await fetch(url,{
                method:"DELETE"
            })
            if(res.ok){
                return true
            }
    } catch (error:any) {
        console.log(error.message)
    }
    
}

