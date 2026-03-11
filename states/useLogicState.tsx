import { auth, authsecond, db } from "@/config/firebse";
import { decryptdata, encryptdata } from "@/logic/encryptdata";
import { registeruserstripe } from "@/logic/registeruserStripe";
import { streamchat_client_frontend } from "@/logic/streamchatregistering";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
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
    }, registerhouse:async(form1:any , form2:any , id:any)=>{
        try {
            const docref = collection(db, "Registos");
            await addDoc(docref, {
                id,
                formulario_dono:form1,
                formulario_imovel:form2,
                estado:'revisao'
            })
        } catch (error:any) {
            console.log(error?.message)
        }   
    },
    getImoveisRegistrado:async(uip:string)=>{
        try {
            const docref = collection(db, "Registos");
            const q = query(docref, where("id", "==",uip))
            const getting = await getDocs(q);
            if(getting.empty){ return false;}
            const result = getting.docs.map((item)=>{
                return item.data()
            })
            return result
        } catch (error) {
            console.log(error)
            return false
        }
         

    }, registar_agente: async(formulario:any , uip:any)=>{
        try {
          const docref = collection(db, "Registos_Agentes");
        await addDoc(docref, {
            id:uip,
            formulario,
            estado:"enviado"
        })  
        return {formulario}
        } catch (error) {
           console.log(error) 
           return false
        }
        
    }, getagenteregisto:async()=>{
        try {
            const saved_data:any = localStorage.getItem('uip')
            const uip = decryptdata(saved_data)?.id
            const docref = collection(db,"Registos_Agentes");
            const q = query(docref, where("id", "==", uip));
            const result = await getDocs(q);
            if(result.empty) {return}
            const res = result.docs.map((item)=>{
                return item.data()
            })
            const dataencrypt = encryptdata(res)
            localStorage.setItem('agentstatus', dataencrypt)
            return res 
        } catch (error) {
            console.log(error)
        }
        
    },getpedidosderegisto_de_casa:async()=>{
            const docref = collection(db, "Registos");
            const getting = await getDocs(docref);
            if(getting.empty) return;
            const res:any = getting.docs.map((item)=>{
                return item.data()
            })
            return res
    },getpedidosderegisto_de_agentes:async()=>{
            const docref = collection(db, "Registos_Agentes");
            const docr = collection(db, "MeuUIP")
            const getting = await getDocs(docref);
            if(getting.empty) return;
           const res: any = await Promise.all(
            getting.docs.map((item) => {
                const q = query(docr, where("Identificacao", "==", item?.data()?.id))
                return getDocs(q).then((g) => {
                    if (g.empty) return item.data()
                    const r = g.docs.map((t) => t.data())
                    return { ...item.data(), ...r[0] } 
                })
            }))
            return res
    },
    adicionar_funcionario:async(formulario:any, documents:any)=>{
        try {
            console.log(formulario, documents)
            const created_email = formulario?.nome?.split(' ')[0]  + "@" + "njinga.com";
            const password = formulario?.numero_do_bilhete + "#$)8134";
            console.log(created_email , password)
            const create_funcionario_account = await createUserWithEmailAndPassword(authsecond, created_email , password)
            const docref = collection(db, "Funcionarios");
            await addDoc(docref, {
                ...formulario,
                documents
            })
            const nome = formulario?.nome?.split(' ')[0]
            const uid = formulario?.numero_do_bilhete;
            const docrefperfil = doc(db, 'Perfil', create_funcionario_account.user.uid)
            const docrefUIP = doc(db, 'MeuUIP', formulario?.numero_do_bilhete )
            const stripe_token = await registeruserstripe(created_email , docrefperfil.id)
            const stream_chat_token = await streamchat_client_frontend(nome, uid , "");
            await setDoc(docrefperfil, {
                id:docrefperfil.id,
                ...formulario,
                role:'colaborator',
                stripe_token,
                stream_chat_token
            })
            await setDoc(docrefUIP, {
                id: docrefUIP.id,
                ...formulario,
                role:'colaborator',
                stripe_token,
                stream_chat_token
            })
            return true
        } catch (error) {
            console.log(error)
            return false
        }
        
    }, getfuncionarios:async()=>{
        const docref = collection(db, "Funcionarios");
        const funcionarios = await getDocs(docref);
        if(funcionarios.empty) return;
        const todos_funcionarios = funcionarios.docs.map((item)=>{
            return item.data()
        })
        return todos_funcionarios;
    },getsingleDocs:async(id:any, quering:any)=>{
        const docref = collection(db, quering);
        const q  = query(docref, where("id","==",id));
        const datas = await getDocs(q);
        if(datas.empty){
            return false
        };
        const res = datas.docs.map((item)=>{
            return item.data()
        })
        return res
    }
}))