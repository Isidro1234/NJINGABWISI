'use client'
import { useStateAuth } from "@/states/useAuthState";
import { createContext, useContext, useEffect, useState } from "react";
import {Chat} from 'stream-chat-react'


interface AuthContextType {
  userdata: any;
  setUserdata: React.Dispatch<React.SetStateAction<any>>;
  isUserLogged: boolean | null;
  setUserLogged: React.Dispatch<React.SetStateAction<boolean | null>>;
  isLoading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | null>(null);
export default function AuthContextProvider({children}:{children:React.ReactNode}){
     const [userdata, setUserdata] = useState<any>(null);
     const [isUserLogged, setUserLogged] = useState<boolean | null>(null);
     const [isLoading, setLoading] = useState<boolean>(false);
    return(
        <AuthContext.Provider value={{userdata, isLoading, setLoading, setUserdata, isUserLogged, 
        setUserLogged}}>
               {children} 
        </AuthContext.Provider>
    )
}  

export const useAuthContext = () => useContext(AuthContext);