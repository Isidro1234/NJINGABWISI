import axios from "axios"

export const api = axios.create({
  // FIX: was hardcoded to localhost:8000, breaking any non-local deploy.
  baseURL: "/api",
  headers: {
    'Content-Type': 'application/json',
    // FIX: required by the backend's CSRF check — a plain cross-site form
    // can't set this header, but this axios client can (and the browser
    // will preflight it against the server's CORS origin whitelist).
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true, // sends the httpOnly session cookie on every request
})

export async function Register(full_name: string, email: string, password: string, idnumber: string, role: string, job: string, phone: string, moradia: string, tipoIdentificacao: Array<string>, nacionalidade: string, accountType: string, tipoVisto: string) {
  const { data } = await api.post('/api/v1/internal/register', { full_name, email, password, idnumber, role, job, phone, moradia, tipoIdentificacao, nacionalidade, accountType, tipoVisto })
  if (!data.sucesso) {
    // FIX: previously swallowed the server's error message entirely.
    throw new Error(data.mensagem || 'Erro ao registar')
  }
  return true
}

export async function Login(identificacao: string, password: string) {
  const { data } = await api.post('/api/v1/internal/login', { identificacao, password })
  return data
}

export async function Logout() {
  const { data } = await api.get('/api/v1/internal/logout')
  return data
}
