import axios from "axios"

export const api = axios.create({
  baseURL:         "https://njinga-api.onrender.com",
  headers:         { 'Content-Type': 'application/json' },
  withCredentials: true,  // ← sends the httpOnly cookie on every request
})


export async function Register(full_name:string, email:string, password:string, idnumber:string, role:string, job:string, phone:string, moradia:string, tipoIdentificacao:Array<string>, nacionalidade:string, accountType:string, tipoVisto:string){
    const {data} = await api.post('/api/v1/internal/register',{full_name, email, password, idnumber, role, job, phone, moradia, tipoIdentificacao,  nacionalidade , accountType , tipoVisto});
    if(!data.sucesso){
        return false
    }
    return true
}
export async function Login(identificacao: string, password: string) {
  const { data } = await api.post('/api/v1/internal/login', { identificacao, password })
  // Don't store anything in localStorage — Zustand handles it
  return data
}

export async function Logout() {

}
