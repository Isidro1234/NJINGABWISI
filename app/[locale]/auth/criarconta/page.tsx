'use client'
import InputLabel from '@/components/custom/InputLabel'
import Logo from '@/components/custom/Logo'
import SelectCustomValue from '@/components/custom/SelectCustomValue'
import { Toaster, toaster } from '@/components/ui/toaster'
import { useAuthContext } from '@/context/authContext'
import { decryptdata } from '@/logic/encryptdata'
import { useStateAuth } from '@/states/useAuthState'
import { Box, Button, HStack, Text, VStack } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

export default function Criarconta() {
  const [form, setForm] = useState(() => ({
    nome: '',
    email: '',
    telefone: '',
    identificacao: '',
    tipoIdentificacao: '',
    password: '',
    confirmPassword: '',
    profissao: '',
    profissaoOutro: '',
    moradia: '',
  }))

  const t = useTranslations('auth.criarconta')
  const set = (field: string) => (value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const enviardados = useStateAuth((state: any) => state.createAccount)
  const { setUserLogged, setUserdata, setLoading }: any = useAuthContext()
  const router = useRouter()

  function validate(): string | null {
    if (!form.nome.trim())                                    return t('errors.nome_required')
    if (form.nome.trim().split(' ').length < 2)               return t('errors.nome_incomplete')
    if (!form.email.trim())                                   return t('errors.email_required')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return t('errors.email_invalid')
    if (!form.moradia.trim())                                 return t('errors.moradia_required')
    if (!form.identificacao.trim())                           return t('errors.identificacao_required')
    if (!form.tipoIdentificacao)                              return t('errors.tipo_identificacao_required')
    if (!form.profissao)                                      return t('errors.profissao_required')
    if (form.profissao === 'outro' && !form.profissaoOutro.trim()) return t('errors.profissao_outro_required')
    if (!form.telefone.trim())                                return t('errors.telefone_required')
    if (form.telefone.trim().length < 9)                      return t('errors.telefone_invalid')
    if (!form.password)                                       return t('errors.password_required')
    if (form.password.length < 6)                             return t('errors.password_short')
    if (!form.confirmPassword)                                return t('errors.confirm_password_required')
    if (form.password !== form.confirmPassword)               return t('errors.passwords_mismatch')
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
      const profissaoFinal = form.profissao === 'outro' ? form.profissaoOutro : form.profissao
      const res = await enviardados(
        form.nome, form.identificacao, form.tipoIdentificacao,
        form.telefone, form.email, form.password, form.moradia, profissaoFinal
      )
      if (res?.nome) {
        const userdata: string = localStorage.getItem('uip') || ''
        setUserdata(decryptdata(userdata))
        setUserLogged(true)
        toaster.create({ title: t('success'), duration: 3000, type: 'success' })
        router.push('/portal')
      } else {
        toaster.create({ title: t('errors.create_failed'), duration: 5000, type: 'error' })
      }
    } catch (_) {
      toaster.create({ title: t('errors.connection_error'), duration: 5000, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const showProfissaoOutro = form.profissao === 'outro'

  return (
    <VStack justifyContent={'center'} padding={10} width={'100%'} bg={'#d33434'}>
      <VStack flexWrap={'wrap'} borderRadius={20} padding={10} gap={2} bg={'white'}>

        <VStack gap={0} marginTop={-10} marginLeft={-5}>
          <Logo />
          <Text fontSize={20} fontWeight={700} marginTop={-4}>{t('title')}</Text>
        </VStack>

        <HStack justifyContent={'flex-start'} width={'100%'}>
          <InputLabel
            type='text' onchange={set('nome')}
            label={t('nome_label')} placeholder={t('nome_placeholder')}
          />
          <InputLabel
            type='email' onchange={set('email')}
            label={t('email_label')} placeholder={t('email_placeholder')}
          />
        </HStack>

        <InputLabel
          type='text' onchange={set('moradia')}
          label={t('moradia_label')} placeholder={t('moradia_placeholder')}
        />

        <HStack gap={1} width={'100%'} alignItems={'center'}>
          <InputLabel
            type='text' onchange={set('identificacao')}
            label={t('identificacao_label')} placeholder={t('identificacao_placeholder')}
          />
          <Box marginTop={5}>
            <SelectCustomValue
              setChange={(e: any) => set('tipoIdentificacao')(e[0])}
              borderRadius={2} width='170px'
              items={[
                { label: t('passport'), value: 'passport' },
                { label: t('bilhete'), value: 'bilhete' },
                { label: t('nif'),     value: 'NIF' },
              ]}
            />
          </Box>
        </HStack>

        <VStack width={'100%'} alignItems={'flex-start'}>
          <Text fontSize={12} color={'gray'}>{t('profissao_label')}</Text>
          <SelectCustomValue
            setChange={(e: any) => set('profissao')(e[0])}
            borderRadius={2} width='100%'
            items={[
              { label: t('profissao_agente'),       value: 'agente' },
              { label: t('profissao_funcionario'),  value: 'funcionario publico' },
              { label: t('profissao_desempregado'), value: 'desempregado' },
              { label: t('profissao_comerciante'),  value: 'comerciante' },
              { label: t('profissao_empreendedor'), value: 'empreendedor' },
              { label: t('profissao_petrolifero'),  value: 'ramo petrolifero' },
              { label: t('profissao_outro'),        value: 'outro' },
            ]}
          />
          {showProfissaoOutro && (
            <InputLabel
              type='text' onchange={set('profissaoOutro')}
              label={t('profissao_outro_label')} placeholder={t('profissao_outro_placeholder')}
            />
          )}
        </VStack>

        <InputLabel
          type='password' onchange={set('password')}
          label={t('password_label')} placeholder={t('password_placeholder')}
        />
        <InputLabel
          type='password' onchange={set('confirmPassword')}
          label={t('confirm_password_label')} placeholder={t('confirm_password_placeholder')}
        />
        <InputLabel
          type='phone' onchange={set('telefone')}
          label={t('telefone_label')} placeholder={t('telefone_placeholder')}
        />

        <Button onClick={submeter} bg={'#d33434'} color={'white'} width={'100%'}>
          {t('submit')}
        </Button>

        <Link href={'/auth/entrar'}>
          <Text fontSize={10} color={'gray'}>
            {t('already_have_account')}{' '}
            <span style={{ color: 'red' }}>{t('click_here')}</span>
          </Text>
        </Link>
      </VStack>
      <Toaster />
    </VStack>
  )
}