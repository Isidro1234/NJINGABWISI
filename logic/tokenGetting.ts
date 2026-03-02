export async function fetchingtoken() {
       const ft = await fetch("http://localhost:3000/api/create-checkout-session", { method: "POST" }) 
       const res = await ft.json();
       return res.client
    }