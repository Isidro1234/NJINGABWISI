'use client'
import LoadingAnim from "@/components/custom/LoadingAnim";
import { useStateAuth } from "@/states/useAuthState"
import { Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
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

export default function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [userdata, setUserdata]       = useState<any>(null)
  const [isUserLogged, setUserLogged] = useState<boolean | null>(null)
  const [isLoading, setLoading]       = useState<boolean>(false)

  const user     = useStateAuth((state: any) => state.user)
  const initAuth = useStateAuth((state: any) => state.initSession)
  const isReady  = useStateAuth((state: any) => state.isReady)
  const router   = useRouter()

  useEffect(() => {
    initAuth()
  }, [])

  useEffect(() => {
    if (!user?.nome) return
    setUserdata(user)
    setUserLogged(true)
  }, [user])

  // ── Redirect after session is ready ───────────────────────────────────────
  useEffect(() => {
    if (!isReady) return
    if (user?.role === 'user')  router.push('/portal')
    if (user?.role === 'admin') router.push('/portaladministrador')
    if (!user?.role) router.push('/')
  }, [isReady, user])

    if(!isReady){
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