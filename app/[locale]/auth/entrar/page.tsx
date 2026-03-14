'use client'
import InputLabel from '@/components/custom/InputLabel'
import Logo from '@/components/custom/Logo'
import { Toaster, toaster } from '@/components/ui/toaster'
import { useAuthContext } from '@/context/authContext'
import { decryptdata } from '@/logic/encryptdata'
import { useStateAuth } from '@/states/useAuthState'
import { Button, Spinner, Text, VStack } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

export default function Entrar() {
  const [form, setForm] = useState(() => ({
    identificacao: '',
    password: '',
  }))

  const t = useTranslations('auth.entrar')
  const enviardados = useStateAuth((state: any) => state.login)
  const { setUserdata, setLoading, isLoading }: any = useAuthContext()
  const router = useRouter()

  function validate(): string | null {
    if (!form.identificacao.trim())       return t('errors.identificacao_required')
    if (form.identificacao.trim().length < 5) return t('errors.identificacao_invalid')
    if (!form.password)                   return t('errors.password_required')
    if (form.password.length < 6)         return t('errors.password_short')
    return null
  }

  async function submeter() {
    const error = validate()
    if (error) {
      toaster.create({ title: error, duration: 4000, type: 'error' })
      return
    }
    setLoading(true)
    try {
      const res = await enviardados(form.identificacao, form.password)
      if (res?.uip?.email) {
        const userdata: string = localStorage.getItem('uip') || ''
        setUserdata(decryptdata(userdata))
        router.push('/auth/codigo')
        return
      }
      toaster.create({ title: t('errors.wrong_credentials'), duration: 5000, type: 'error' })
    } catch (_) {
      toaster.create({ title: t('errors.connection_error'), duration: 5000, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <VStack justifyContent={'center'} padding={10} h={'100%'} width={'100%'} bg={'#d33434'}>
      <VStack flexWrap={'wrap'} borderRadius={20} padding={10} gap={4} bg={'white'} width={'100%'} maxWidth={'400px'}>

        <VStack gap={0} marginTop={-10} marginLeft={-5}>
          <Logo />
          <Text fontSize={20} fontWeight={700} marginTop={-4}>{t('title')}</Text>
        </VStack>

        <Text width={'100%'} textAlign={'center'} fontSize={12} color={'gray'}>
          {t('subtitle')}
        </Text>

        <InputLabel
          type='text'
          onchange={(e: any) => setForm((p) => ({ ...p, identificacao: e }))}
          label={t('identificacao_label')}
          placeholder={t('identificacao_placeholder')}
        />

        <InputLabel
          type='password'
          onchange={(e: any) => setForm((p) => ({ ...p, password: e }))}
          label={t('password_label')}
          placeholder={t('password_placeholder')}
        />

        <Button onClick={submeter} bg={'#d33434'} color={'white'} width={'100%'}>
          {isLoading ? <Spinner size={'sm'} /> : t('submit')}
        </Button>

        <Link href={'/auth/criarconta'}>
          <Text fontSize={10} color={'gray'}>
            {t('no_account')}{' '}
            <span style={{ color: 'red' }}>{t('click_here')}</span>
          </Text>
        </Link>
      </VStack>
      <Toaster />
    </VStack>
  )
}