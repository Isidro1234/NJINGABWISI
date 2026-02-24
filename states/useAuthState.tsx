

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import {create} from 'zustand'
import {auth , db} from '../config/firebse'
import { codeemail } from '@/logic/codeemail';


export const useStateAuth = create((set, get)=>({
    code:null,
    login:async(Identificacao:string, tipoIdentificacao:string, password:string)=>{
        try {
            const docref = collection(db, "Perfil")
            const q = query(docref, where("Identificacao", "==", Identificacao));
            const getting = await getDocs(q);
            if(getting.empty) return;
            const res = getting.docs.map((item)=>{
                    return item.data()
            })
            const email = res[0].email;
            console.log(email, res)
            const credentials = await signInWithEmailAndPassword(auth,email,password);
            const code = await codeemail(email)
            if(!code) return;
            set({code})
            if(!credentials.user.email) return;
            return true 
        } catch (error:any) {
            console.log(error.message)
            return false
        }
        
    },
    createAccount:async(nome:string, Identificacao:string, tipoIdentificacao:string, Phonenumber:string, email:string, password:string)=>{
        try {
            console.log(nome)
           const credentials = await createUserWithEmailAndPassword(auth, email , password);
           if(!credentials.user.email) return;
           const userid = credentials.user.uid
           const docref : any = doc(db, 'Perfil', userid)
           await setDoc(docref, {
              nome, 
              Identificacao, 
              tipoIdentificacao, 
              Phonenumber, 
              email,
           })
           await updateProfile(credentials.user,{
             displayName:nome,
           })
           return true
        } catch (error:any) {
            console.log(error.message)
            return false
        }
    }
}))