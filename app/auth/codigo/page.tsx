"use client"
import CustomOTP from '@/components/custom/CustomOtp'
import { auth } from '@/config/firebse'
import { useAuthContext } from '@/context/authContext'
import { useStateAuth } from '@/states/useAuthState'
import { Box, Button, Heading, Input, Spinner, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function Code() {
  const router = useRouter();
  const code = useStateAuth((state:any)=>state?.code);
  const [currentCode, setCode] = useState(0);
  const [userCode, setUserCode] = useState(0);
  const [loading, setLoadings] = useState(false)
  const {setLoading, setUserdata, setUserLogged, isLoading}:any = useAuthContext()
  useEffect(()=>{
    async function getting(){
        const res = await code
        setCode(res)
    }
    getting()
  }, [code])

  function checkCode(){
    setLoadings(true)
     if(currentCode == userCode){
        setLoadings(false)
        setLoading(false)
        setUserdata(auth.currentUser?.displayName)
        setUserLogged(true)
        router.push('/portal')
        return;
     }
     setLoadings(false)
     return;
  }
  return (
    <VStack bg={'#d33434'} width={'100%'} height={'100%'} padding={10}>
       <Box display={'flex'} flexDirection={'column'} gap={4} bg={'white'} padding={10} borderRadius={20}>
        <Heading>Codigo de Seguranca</Heading>
          <CustomOTP onchange={(e:any)=>{setUserCode(e)}}/>
          <Button onClick={checkCode}>{isLoading ?  <Spinner/> : "Enviar"} </Button>
       </Box>
    </VStack>
  )
}
