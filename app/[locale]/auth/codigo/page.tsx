"use client"
import CustomOTP from '@/components/custom/CustomOtp'
import { useAuthContext } from '@/context/authContext'
import { decryptdata } from '@/logic/encryptdata'
import { useStateAuth } from '@/states/useAuthState'
import { Box, Button, Spinner, Text, VStack } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function Code() {
  const t = useTranslations('auth.codigo')
  const router = useRouter()
  const code = useStateAuth((state: any) => state?.verificarCodigo)
  const code2 = useStateAuth((state: any) => state?.resendEmail)
  const [userCode, setUserCode] = useState(0)
  const {setUserdata, setUserLogged, setLoading, isLoading}:any = useAuthContext()


  async function checkCode() { 
    setLoading(true)
    const res = await code(userCode)
  
    if (res.email) {
      setUserdata(res)
      router.push('/portal')
      setLoading(false)
      return
    }
    setLoading(false)
  }

  async function resendcode(){
    const stringdata = localStorage.getItem('uip') || ''
    const decrypt =  decryptdata(stringdata)
    console.log(decrypt, stringdata)
    const res = await code2(decrypt.id )
  }

  return (
    <VStack bg={'#d33434'} width={'100%'} height={'100%'} padding={10}>
      <Box display={'flex'} flexDirection={'column'} gap={4} bg={'white'} padding={10} borderRadius={20}>
        <Text fontSize={20} fontWeight={700}>{t('title')}</Text>
        <Text fontSize={12} color={'gray'}>{t('subtitle')}</Text>
        <CustomOTP onchange={(e: any) => setUserCode(e)} />
        <Button disabled={isLoading} onClick={checkCode}>
          {isLoading ? <Spinner color={'white'} size={'sm'} /> : t('submit')}
        </Button>
        <Text onClick={resendcode} _hover={{textDecoration:"underline", cursor:"pointer"}} color={'gray'} fontSize={12}>Resend code through email</Text>
      </Box>
      
    </VStack>
  )
}