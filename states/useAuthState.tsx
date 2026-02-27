

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import {create} from 'zustand'
import {auth , db} from '../config/firebse'
import { codeemail } from '@/logic/codeemail';


export const useStateAuth = create((set, get)=>({
    code:null,
    login:async(Identificacao:string, password:string)=>{
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
    createAccount:async(nome:string, Identificacao:string, tipoIdentificacao:Array<string>, Phonenumber:string, email:string, 
        password:string, moradia:string, profissao:string)=>{
        try {
            console.log(nome)
            const check = await getDocs(query(collection(db, 'Perfil'), where('Identificacao', '==', Identificacao)))
            if(!check.empty){
                alert('Identificacao ja existe')
                return;
            }
           const credentials = await createUserWithEmailAndPassword(auth, email , password);
           if(!credentials.user.email) return;
           const userid = credentials.user.uid
           const docref : any = doc(db, 'Perfil', userid)
           const docrefUip:any = doc(db, 'MeuUIP', Identificacao);
           const shortuip_id = tipoIdentificacao[0][0].toUpperCase() + Identificacao.slice(Identificacao.length - 4, Identificacao.length - 1);
           
           await setDoc(docref, {
              id:userid,
              nome, 
              Identificacao, 
              tipoIdentificacao, 
              Phonenumber, 
              email,
              createdAt:new Date(),
              photo:null
           })
           await setDoc(docrefUip, {
              id:Identificacao,
              shortuip_id,
              nome, 
              Identificacao, 
              tipoIdentificacao, 
              Phonenumber, 
              email,
              moradia,
              profissao,
              createdAt:new Date(),
              estado:'activo',
              photo:null
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