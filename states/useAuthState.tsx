import { api, Login, Register } from "@/logic/auth"
import { create } from "zustand"

export const useStateAuth = create<any>((set, get) => ({
  user:    null,
  MyUIP:   null,
  isReady: false, // true after initSession completes
  // FIX: `access_token` field removed — nothing ever set it, since the
  // backend's JWT refresh flow was dead code and has been removed there too.
  // Auth is the httpOnly session cookie; no token needs to live in JS.

  // ── Call this once in your root layout on mount ───────────
  initSession: async () => {
    try {
      const me = await api.get('/api/v1/internal/me')
      if (me?.data?.success) {
        set({ user: me.data.user })
      }
    } catch {
      // No valid session cookie — user is not logged in, that's fine
    } finally {
      set({ isReady: true }) // ← ALWAYS unblock the UI
    }
  },

  // ── Login ─────────────────────────────────────────────────
  login: async (identificacao: string, password: string) => {
    try {
      const data = await Login(identificacao, password)
      if (!data.sucesso) {
        return false
      }
      // FIX: the store's `user` was never updated after a successful login —
      // anything reading `user` (e.g. the redirect effect in
      // AuthContextProvider) wouldn't see it until some later call to
      // initSession() happened to run.
      set({ user: data.user })
      return data.user.email
    } catch (error: any) {
      console.error(error?.response?.data?.mensagem || error.message)
      return false
    }
  },

  // ── After registration code verification ──────────────────
  verificarCodigo: async (code: string) => {
    try {
      const { data } = await api.post('/api/v1/internal/activarcode', { code })
      if (!data.success) return false
      set({ user: data.user }) // FIX: keep the store in sync, same as login
      return data.user
    } catch (error) {
      console.error(error)
      return false
    }
  },

  createAccount: async (full_name: string, email: string, password: string, idnumber: string, role: string, job: string, phone: string, moradia: string, tipoIdentificacao: Array<string>, nacionalidade: string, accountType: string, tipoVisto: string) => {
    try {
      return await Register(full_name, email, password, idnumber, role, job, phone, moradia, tipoIdentificacao, nacionalidade, accountType, tipoVisto)
    } catch (error) {
      console.error(error)
      return false
    }
  },

  logout: async () => {
    try {
      await api.get('/api/v1/internal/logout') // revokes the session cookie server-side
    } finally {
      set({ user: null, MyUIP: null })
    }
  },

  // FIX: the backend now identifies the pending registration via an httpOnly
  // cookie, not a body param, so no id is passed here anymore.
  resendEmail: async () => {
    try {
      const { data } = await api.post('/api/v1/internal/resendCode')
      return !!data.sucesso
    } catch {
      return false
    }
  },

  myuipget: async () => {
    try {
      const data = await api.get('/api/v1/internal/myUIP')
      set({ MyUIP: data.data })
      return data?.data ?? false
    } catch {
      return false
    }
  }
}))
