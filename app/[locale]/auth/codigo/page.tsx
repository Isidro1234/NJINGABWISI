"use client"
import CustomOTP from '@/components/custom/CustomOtp'
import { useStateAuth } from '@/states/useAuthState'
import { Box, Button, Spinner, Text, VStack } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function Code() {
  const t = useTranslations('auth.codigo')
  const router = useRouter()
  const code = useStateAuth((state: any) => state?.code)
  const [currentCode, setCode] = useState(0)
  const [userCode, setUserCode] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function getting() {
      const res = await code
      setCode(res)
    }
    getting()
  }, [code])

  function checkCode() {
    setLoading(true)
    if (currentCode == userCode) {
      router.push('/portal')
      return
    }
    setLoading(false)
  }

  return (
    <VStack bg={'#d33434'} width={'100%'} height={'100%'} padding={10}>
      <Box display={'flex'} flexDirection={'column'} gap={4} bg={'white'} padding={10} borderRadius={20}>
        <Text fontSize={20} fontWeight={700}>{t('title')}</Text>
        <Text fontSize={12} color={'gray'}>{t('subtitle')}</Text>
        <CustomOTP onchange={(e: any) => setUserCode(e)} />
        <Button onClick={checkCode}>
          {loading ? <Spinner /> : t('submit')}
        </Button>
      </Box>
    </VStack>
  )
}