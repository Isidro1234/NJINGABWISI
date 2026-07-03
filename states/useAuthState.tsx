import { api, Login,  Register } from "@/logic/auth"
import { create } from "zustand"

export const useStateAuth = create<any>((set, get) => ({
  access_token: null,   // lives in memory only — gone on hard refresh, restored by initSession
  user:         null,
  MyUIP:        null,
  isReady:      false,  // true after initSession completes


  // ── Call this once in your root layout on mount ───────────
  initSession: async () => {
  try {

    try {
      const me = await api.get('/api/v1/internal/me')
      if (me?.data?.success) {
        set({ user: me.data.user })
      }
    } catch {
      // /me failed but we still have a token — not fatal
    }
  } catch {
    // No cookie or invalid cookie — user is not logged in, that's fine
  } finally {
    set({ isReady: true })  // ← ALWAYS unblock the UI
  }
},

  // ── Login ─────────────────────────────────────────────────
  login: async (identificacao: string, password: string) => {
    try {
      const data = await Login(identificacao, password)
      // Cookie is set by the server automatically
      return data.user.email
    } catch (error: any) {
      console.error(error.message)
      return false
    }
  },

  // ── After registration code verification ──────────────────
  verificarCodigo: async (code: string) => {
    try {
      const { data } = await api.post('/api/v1/internal/activarcode', { code })
      if (!data.success) return false


      return data.user
    } catch (error) {
      console.error(error)
      return false
    }
  },

  createAccount: async ( full_name: string, email: string, password: string, idnumber: string, role: string, job: string, phone: string, moradia: string, tipoIdentificacao: Array<string>, nacionalidade: string , accountType: string , tipoVisto: string) => {
    try {
      const res = await Register( full_name, email, password, idnumber, role, job, phone, moradia, tipoIdentificacao, nacionalidade , accountType , tipoVisto)
      if(res){
        return true
      }else{
        return false
      }
    } catch {
      return false
    }
  },

  logout: async () => {
    try {
      await api.get('/api/v1/internal/logout')  // revokes cookie on server
    } finally {
      set({user: null, MyUIP: null })
    }
  },

  resendEmail: async (user_id: string) => {
    try {
      const { data } = await api.post('/api/v1/internal/resendCode', { user_id })
      return !!data.successo
    } catch {
      return false
    }
  },myuipget : async () => {
    try {
      const data = await api.get('/api/v1/internal/myUIP')
      set({ MyUIP: data.data })
      return data?.data ?? false
    } catch {
      return false
    } 
   }
}))