import { auth, authsecond, db } from "@/config/firebse";
import { decryptdata, encryptdata } from "@/logic/encryptdata";
import { registeruserstripe } from "@/logic/registeruserStripe";
import { streamchat_client_frontend } from "@/logic/streamchatregistering";
import { Filter } from "firebase-admin/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, or, query, setDoc, updateDoc, where } from "firebase/firestore";
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
                ref:docref.id,
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
            ref:docref.id,
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
            return res 
        } catch (error) {
            console.log(error)
        }
        
    },getpedidosderegisto_de_casa: async () => {
    try {
        const docref = collection(db, "Registos");
        const getting = await getDocs(docref);
        if (getting.empty) return [] 
        return getting.docs.map((item) => item.data())
    } catch (error: any) {
        console.log(error?.message)
        return []  
    }
},

getpedidosderegisto_de_agentes: async () => {
    try {
        const docref = collection(db, "Registos_Agentes");
        const docr = collection(db, "MeuUIP")
        const getting = await getDocs(docref);
        if (getting.empty) return [] 
        const res: any = await Promise.all(
            getting.docs.map((item) => {
                const q = query(docr, where("Identificacao", "==", item?.data()?.id))
                return getDocs(q).then((g) => {
                    if (g.empty) return item.data()
                    const r = g.docs.map((t) => t.data())
                    return { ...item.data(), ...r[0] }
                })
            })
        )
        return res
    } catch (error: any) {
        console.log(error?.message)
        return []  
    }
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
            const uid = formulario?.numero_do_bilhete?.slice(0, 5);
            const docrefperfil = doc(db, 'Perfil', create_funcionario_account.user.uid)
            const docrefUIP = doc(db, 'MeuUIP', formulario?.numero_do_bilhete )
            const stripe_token = await registeruserstripe(created_email , docrefperfil.id)
            const stream_chat_token = await streamchat_client_frontend(nome, uid , "", true);
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
    }, aceitar_or_negar_submission:async(status:string, userId:string , casainfo:any , 
        type:string, ref_do_documento:string)=>{
        try {
            const dotc = collection(db, type);
                const q = query(dotc, where("id", "==",userId));
                const res = await getDocs(q);
                if(res.empty) return;
                const id = res.docs.map((item)=>{
                    return item.ref
                })
                const dorefR = id[0]
            if(status === 'aprovado' && type === "Registos"){
                const docrefc = collection(db, "MeuUIP", userId , "Propriedades");
                const r = await addDoc(docrefc,{
                    id:userId,
                    ...casainfo,
                    added_at:new Date(),
                    estado:'aprovado'
                }) 
                await updateDoc(dorefR, {
                    estado:"aprovado",
                    ultima_propriedade_enviada:r.id,
                })
                return {res:"aprovado", message:true}
            }else if(status === 'aprovado' && type === "Registos_Agentes"){
                const docuip = doc(db, "MeuUIP", userId)
                await updateDoc(dorefR, {
                    estado:"aprovado"
                })
                await updateDoc(docuip, {
                    shortuip_id:`A${userId.slice(userId.length-4, userId.length-1)}`
                })
            }
            if(status == "negado"){
                const docret = doc(db, "MeuUIP", userId , "Propriedades", ref_do_documento);
                await deleteDoc(docret);
            }
            await updateDoc(dorefR, {
                estado:status
            })
            return {res:status, message:true} 
        } catch (error:any) {
            console.log(error?.message)
            return {res:false, messaging:false}
        }
    },
    vender_imovel:async(current_dono_uip:string, intermediario_uip:string, temIntermediario:boolean,
         comprador_uip:string, preco:string, percentagem_dono:string,
         percentagem_intermediario:string, propriedade_id:string)=>{
            try {
                const docreftransacao_de_imovel = doc(db, "Transacao_de_Imoveis", propriedade_id);
                 const intermediario = intermediario_uip || null;
                 const percentagem_int = percentagem_intermediario || 0
                 const docref_pedido_de_venda = doc(db, "Pedido_de_Venda", propriedade_id);
                 const resd = await getDoc(docref_pedido_de_venda);
                 if(!resd.exists()) {
                    const titulo ="pedido de venda do imovel" + propriedade_id
                    await setDoc(docref_pedido_de_venda,{
                        title:titulo,
                        dono_do_imove:current_dono_uip,
                        intermediario,
                        comprador:comprador_uip,
                        preco,
                        percentagem_do_dono: percentagem_dono,
                        percentagem_do_intermediario:percentagem_intermediario,
                        pedido_efetuado_na_data:new Date(),
                        _comprador_concorda:null,
                        _vendedor_concorda:true,
                    })
                    return
                 }
                 if(!resd.data()?._comprador_concorda || !resd.data()?.vendedor_concorda){
                    return false;
                 }
                    const percentagem_do_dono = '100%';
                    const propriedade_ref = doc(db, "MeuUIP", current_dono_uip , "Proprieades", propriedade_id);
                    const propriedades_compradordocRef = doc(db, "MeuUIP",comprador_uip);
                    const propriedades_compradorRef = collection(propriedades_compradordocRef, "Propriedades");
                    const obter_propriedade = await getDoc(propriedade_ref);
                    if(!obter_propriedade.exists()) return;
                    const propriedade = obter_propriedade.data();
                    await addDoc(propriedades_compradorRef, {
                        ...propriedade,
                        dono:comprador_uip,
                        dono_anterior:current_dono_uip,
                        houve_intermediacao:temIntermediario,
                        intermediario: intermediario,
                        data_de_transferencia: new Date()
                    })
                    await deleteDoc(propriedade_ref);
                    await setDoc(docreftransacao_de_imovel, {
                         dono:comprador_uip,
                         dono_anterior:current_dono_uip,
                         percentagem_dono,
                         houve_intermediacao:temIntermediario,
                         preco_do_imovel:preco,
                         percentagem_do_intermediario: percentagem_int,
                         data_de_transferencia: new Date()
                    })
                return true
            } catch (error) {
                console.log(error)
                return false
               
            }
    },pesquisarFuncionario:async(pesquisa:string)=>{ //pesquisar funcionarios
        try {
            const docre =  collection(db, "Funcionarios");
            const q = query(docre, or(where("nome","==",pesquisa), where("numero_do_bilhete", "==",pesquisa),
        where("provincia","==",pesquisa))   )
            const funcionarios = await getDocs(q);
            if(funcionarios.empty) return [];
            const lista_de_funcionarios = funcionarios.docs.map((item)=>{
                return item.data()
            })
            return lista_de_funcionarios
        } catch (error) {
            console.log(error)
            return []
        }
            
    }, queryUserUIP: async(pesquisa:string)=>{
        try {
           const docref = collection(db, "MeuUIP")
        const q = query(docref, or (where("id","==",pesquisa), where("short_uip","==",pesquisa) ))
        const uips = await getDocs(q);
        if(uips.empty) return []
        const res = uips.docs.map((item)=>{
            return item.data()
        })
        return res || [] 
        } catch (error) {
           return []   
        }
    }

}))