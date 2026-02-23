export async function codeemail(email:string){
     const getCode = await fetch('/api/email', {
        method:"POST",
        headers:{
            "Content-Type":'application/json',
        },
        body:JSON.stringify({email})
     })
     const res = await getCode.json();
     if(!res.message) return false
     return res?.res
}