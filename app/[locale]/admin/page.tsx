"use client"
import InputLabel from '@/components/custom/InputLabel'
import { Toaster, toaster } from '@/components/ui/toaster'
import { useAuthContext } from '@/context/authContext'
import { useStateAuth } from '@/states/useAuthState'
import { Box, Button, HStack, Text, VStack } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'

export default function Entrar() {
  const t = useTranslations('admin.entrar')
  const [form, setForm] = useState(() => ({
    identificacao: null as string | null,
    codigo_de_entrada: null as string | null,
    senha: null as string | null,
  }))


  const login = useStateAuth((state: any) => state?.loginAdmin)

  function validate(): string | null {
    if (!form.identificacao?.trim())            return t('errors.identificacao_required')
    if (form.identificacao.trim().length < 5)   return t('errors.identificacao_invalid')
    if (!form.senha?.trim())                    return t('errors.senha_required')
    if (form.senha.trim().length < 6)           return t('errors.senha_short')
    if (!form.codigo_de_entrada?.trim())        return t('errors.codigo_required')
    if (form.codigo_de_entrada.trim().length < 4) return t('errors.codigo_invalid')
    return null
  }

  async function entrar() {
    const error = validate()
    if (error) {
      toaster.create({ title: error, duration: 4000, type: 'error' })
      return
    }
    try {
      const res = await login(form.identificacao, form.senha, form.codigo_de_entrada)
      if (!res) {
        toaster.create({ title: t('errors.wrong_credentials'), duration: 5000, type: 'error' })
        return
      }
    } catch (_) {
      toaster.create({ title: t('errors.connection_error'), duration: 5000, type: 'error' })
    }
  }

  return (
    <VStack padding={10} minHeight={'100vh'} justifyContent={'center'}>
      <VStack alignItems={'flex-start'} borderRadius={20} bg={'white'}
        padding={10} gap={4} width={'100%'} maxWidth={'420px'} boxShadow={'sm'}>

        {/* Logo */}
        <VStack gap={1} width={'100%'} alignItems={'center'}>
          <Text fontSize={35} lineHeight={0.9} fontWeight={700}>
            <span className='logo-text-1'>N</span>
            <span className='logo-text-2'>J</span>
            <span className='logo-text-3'>I</span>NGA
          </Text>
          <Text fontSize={12} color={'gray'}>{t('welcome')}</Text>
        </VStack>

        <Text width={'100%'} textAlign={'center'} fontSize={12} color={'gray'}>
          {t('subtitle')}
        </Text>

        {/* Identificação */}
        <InputLabel
          label={t('identificacao_label')}
          onchange={(e: any) => setForm((p) => ({ ...p, identificacao: e }))}
          placeholder={t('identificacao_placeholder')}
          type='text'
        />

        {/* Senha */}
        <InputLabel
          label={t('senha_label')}
          onchange={(e: any) => setForm((p) => ({ ...p, senha: e }))}
          placeholder={t('senha_placeholder')}
          type='password'
        />

        {/* Código de entrada */}
        <Box width={'100%'}>
          <HStack alignItems={'end'} width={'100%'}>
            <Box flex={1}>
              <InputLabel
                label={t('codigo_label')}
                onchange={(e: any) => setForm((p) => ({ ...p, codigo_de_entrada: e }))}
                placeholder={t('codigo_placeholder')}
                type='text'
              />
            </Box>
            <Button bg={'#d33434'} color={'white'} height={'40px'} fontSize={12} flexShrink={0}>
              {t('receive_code')}
            </Button>
          </HStack>
          <Text fontSize={10} color={'gray'} marginTop={1}>
            {t('codigo_hint')}
          </Text>
        </Box>

        <Button onClick={entrar} width={'100%'} bg={'#d33434'} color={'white'}>
          {t('submit')}
        </Button>
      </VStack>
      <Toaster />
    </VStack>
  )
}