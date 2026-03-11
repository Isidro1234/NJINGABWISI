"use client"
import { useStateAuth } from '@/states/useAuthState'
import { Button, VStack } from '@chakra-ui/react'
import React from 'react'

export default function Perfiladmin() {
    const logout = useStateAuth((state:any)=>state.logout)
    async function logouts(){
        await logout()
    }
  return (
    <VStack>
        <Button onClick={logouts}>sair</Button> 
    </VStack>
  )
}
