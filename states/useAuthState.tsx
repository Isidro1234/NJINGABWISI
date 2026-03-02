

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import {create} from 'zustand'
import {auth , db} from '../config/firebse'
import { codeemail } from '@/logic/codeemail';
import { registeruserstripe } from '@/logic/registeruserStripe';
import { encryptdata } from '@/logic/encryptdata';


export const useStateAuth = create((set, get)=>({
    code:null,
    uip:[],
    login:async(Identificacao:string, password:string)=>{
        try {
            localStorage.removeItem('uip');
            const docref = collection(db, "Perfil")
            console.log('entrou')
            const q = query(docref, where("Identificacao", "==", Identificacao));
            const getting = await getDocs(q);
            if(getting.empty) return;
            console.log('entrou e checkou o id')
            const res = getting.docs.map((item)=>{
                    return item.data()
            })
            const uip:any = doc(db, 'MeuUIP', res[0].Identificacao)
            const getuip = await getDoc(uip);
            if(!getuip.exists()) return;
            const uipdata:any = getuip.data()
            const encrypt = encryptdata(uipdata)
            localStorage.setItem('uip', encrypt)
            const email = res[0].email;
            console.log('workin', email, res)
            const credentials = await signInWithEmailAndPassword(auth,email,password);
            console.log('entrou e fez o login,', credentials)
            const code = await codeemail(email)
            console.log('resoleveu o code', code)
            if(!code) return;
            set({code})
            if(!credentials.user.email) return;
            console.log('entrou e resposta final')
            return {uip:uipdata}
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
                alert('Identificacao ja existe');
                return;
            }
           const credentials = await createUserWithEmailAndPassword(auth, email , password);
           if(!credentials.user.email) return;
           const userid = credentials.user.uid
           const docref : any = doc(db, 'Perfil', userid)
           const docrefUip:any = doc(db, 'MeuUIP', Identificacao);
           const shortuip_id = tipoIdentificacao[0][0].toUpperCase() + Identificacao.slice(Identificacao.length - 4, Identificacao.length - 1);
           const register_user_stripe = await registeruserstripe(email, Identificacao)
           await setDoc(docref, {
              id:userid,
              nome, 
              Identificacao, 
              tipoIdentificacao, 
              Phonenumber, 
              email,
              createdAt:new Date(),
              photo:null,
              stripe_customer_id : register_user_stripe,
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
              photo:null,
              stripe_customer_id : register_user_stripe,
           })
           await updateProfile(credentials.user,{
             displayName:nome,
           })
            const getuip = await getDoc(docrefUip);
            if(!getuip.exists()) return;
            const uipdata:any = getuip.data()
            const encrypt = encryptdata(uipdata)
            localStorage.setItem('uip', encrypt)
           return  {
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
              photo:null,
              stripe_customer_id : register_user_stripe,
           }
        } catch (error:any) {
            console.log(error.message)
            return false
        }
    },
    logout:async()=>{
        auth.signOut();
        localStorage.removeItem('uip');
    }
}))