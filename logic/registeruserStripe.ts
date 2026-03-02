export const registeruserstripe = async(email:string, id:string)=>{
    const register = await fetch('http://localhost:3000/api/create-customer', {
        method:'POST',
        headers:{
            "Content-Type" : 'application/json'
        },
        body:JSON.stringify({email , id})
    });
    const response : {customer_id:string, res:boolean} = await register.json();
    if(!response.res) {
        return false
    }
    return response.customer_id
}