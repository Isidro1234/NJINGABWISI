'use client'
import { createContext, useContext, useState } from "react";




const AuthContext = createContext({});
export default function AuthContextProvider({children}:{children:React.ReactNode}){
    const [userdata, setUserdata] = useState(null);
    const [isUserLogged, setUserLogged] = useState(null)
    const [isLoading, setLoading] = useState(false)
    return(
        <AuthContext.Provider value={{userdata, isLoading, setLoading, setUserdata, isUserLogged, setUserLogged}}>
            {children}
        </AuthContext.Provider>
    )
}  

export const useAuthContext = () => useContext(AuthContext);