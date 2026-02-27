import { db } from "@/config/firebse";
import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";



export const useLogicState = create((set, get)=>({
    UIPprofile:[],
    getUIPprofile:async(uip:string)=>{
        try {
            const prodocref = doc(db, 'MeuUIP', uip)
            const getuip = await getDoc(prodocref);
            if(!getuip.exists()) return; 
            set({UIPprofile:getuip.data()}) 
            return getuip.data()
        } catch (error:any) {
            console.log(error?.message)
        }   
    }
}))