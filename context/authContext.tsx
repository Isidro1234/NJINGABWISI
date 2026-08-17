'use client'
import LoadingAnim from "@/components/custom/LoadingAnim";
import { useStateAuth } from "@/states/useAuthState"
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react"

interface AuthContextType {
  userdata: any;
  setUserdata: React.Dispatch<React.SetStateAction<any>>;
  isUserLogged: boolean | null;
  setUserLogged: React.Dispatch<React.SetStateAction<boolean | null>>;
  isLoading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// FIX: routes that don't require an active session — adjust to your app.
const PUBLIC_ROUTES = ['/', '/login', '/register']

export default function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [userdata, setUserdata]       = useState<any>(null)
  const [isUserLogged, setUserLogged] = useState<boolean | null>(null)
  const [isLoading, setLoading]       = useState<boolean>(false)

  const user     = useStateAuth((state: any) => state.user)
  const initAuth = useStateAuth((state: any) => state.initSession)
  const isReady  = useStateAuth((state: any) => state.isReady)
  const router   = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    initAuth()
  }, [])

  useEffect(() => {
    if (!user?.nome) return
    setUserdata(user)
    setUserLogged(true)
  }, [user])

  // FIX: the original effect pushed a route on every isReady/user change
  // with no check against the current pathname — that could redirect-loop
  // and bounced logged-out users off every public page (including '/')
  // back to '/' itself. Now it only redirects when the current route
  // actually mismatches the auth state.
  const normalize = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p)

useEffect(() => {
  if (!isReady) return

  const path = normalize(pathname)

  if (user?.role === 'user' && path !== '/portal') {
    router.push('/portal')
  } else if (user?.role === 'admin' && path !== '/portaladministrador') {
    router.push('/portaladministrador')
  } 
}, [isReady, user, pathname])

  if (!isReady) {
    return <LoadingAnim/>
  }
  return (
    <AuthContext.Provider value={{
      userdata, setUserdata,
      isUserLogged, setUserLogged,
      isLoading, setLoading,
    }}>
      { children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
