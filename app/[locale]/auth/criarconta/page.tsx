'use client'
import InputLabel from '@/components/custom/InputLabel'
import Logo from '@/components/custom/Logo'
import SelectCustomValue from '@/components/custom/SelectCustomValue'
import { Toaster, toaster } from '@/components/ui/toaster'
import { useAuthContext } from '@/context/authContext'
import { decryptdata } from '@/logic/encryptdata'
import { useStateAuth } from '@/states/useAuthState'
import { Box, Button, HStack, Spinner, Text, VStack } from '@chakra-ui/react'
import { Country } from 'country-state-city'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useMemo, useState } from 'react'

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
    accountType: '',
    tipoVisto: '',
    nacionalidade: 'angola' ,
  }))
  const countries = useMemo(() =>
      Country.getAllCountries().map((item) => ({ value: item.name, label: item.name }))
    , [])
  const t = useTranslations('auth.criarconta')
  const set = (field: string) => (value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const enviardados = useStateAuth((state: any) => state.createAccount)
  const { setLoading , isLoading }: any = useAuthContext()
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
    if (!form.accountType)                                    return "profavor selecione a categoria que se enquadra"
    if (form.accountType === 'visto' && !form.tipoVisto)      return "porfavor adicione o tipo do seu visto"
    if (form.accountType !== 'cidadao' && !form.nacionalidade)  return "profavor adicione a sua nacionalidade"
    if (form.accountType !== 'cidadao' && form.nacionalidade && form.nacionalidade === 'angola') return "Porfavor selecione a nacionalidade correta"
    return null
  }

  async function submeter() {
    setLoading(true)
    const error = validate()
      
    if (error) {
      toaster.create({ title: error, duration: 4000, type: 'error' })
        setLoading(false)
      return
    }
    try {
      const profissaoFinal = form.profissao === 'outro' ? form.profissaoOutro : form.profissao
      const res = await enviardados(
        form.nome, form.email, form.password , form.identificacao, "user" , profissaoFinal , form.telefone, form.moradia, form.tipoIdentificacao, form.nacionalidade , form.accountType , form.tipoVisto
      )
      if (res) {
        toaster.create({ title: t('success'), duration: 3000, type: 'success' })
        router.push('/auth/codigo')
        setLoading(false)
        return
      } else {
        toaster.create({ title: t('errors.create_failed'), duration: 5000, type: 'error' })
        setLoading(false)
        return
      }
    } catch (_) {
      toaster.create({ title: t('errors.connection_error'), duration: 5000, type: 'error' })
      setLoading(false)
      return
    } finally {
      setLoading(false)
      return
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
        <Box width={'100%'} display={'flex'} flexDirection={'column'} gap={1}>
                <Text fontSize={12} color={'gray'}>{t('moradia_label')}</Text>
                <SelectCustomValue setChange={(e: any) => set('moradia')(e[0])}
                  borderRadius={0} width={'100%'} items={countries} />
          </Box>
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
        <VStack gap={0} width={'100%'} alignItems={'flex-start'}>
          <Text lineHeight={1.2} fontSize={12} color={'gray'}>Qual categoria você se enquadra?</Text>
          <Box marginTop={2} width={'100%'}>
            <SelectCustomValue
              setChange={(e: any) => set('accountType')(e[0])}
              borderRadius={2} width='100%'
              items={[
                { label: 'sou um cidadao angolano', value: 'cidadao' },
                { label: 'tenho um visto', value: 'visto' },
                { label: 'estou em estado irregular',     value: 'irregular' },
                { label: 'sou um residente temporário',     value: 'residente_temporario' },
                {label: 'sou um residente permanente', value: 'residente_permanente' },
              ]}
            />
          </Box>
        </VStack>
        <Box width={'100%'} display={form.accountType !== 'cidadao' ? 'flex' : 'none'} flexDirection={'column'} gap={1}>
                <Text fontSize={12} color={'gray'}>Qual é a sua nacionalidade?</Text>
                <SelectCustomValue setChange={(e: any) => set('nacionalidade')(e[0])}
                  borderRadius={0} width={'100%'} items={countries} />
        </Box>
        <VStack display={form.accountType === 'visto' ? "flex" : "none"} gap={0} width={'100%'} alignItems={'flex-start'}>
          <Text lineHeight={1.2} fontSize={12} color={'gray'}>Tipo de Visto?</Text>
          <Box marginTop={2} width={'100%'}>
            <SelectCustomValue
              setChange={(e: any) => set('tipoVisto')(e[0])}
              borderRadius={2} width='100%'
              items={[
                { label: 'visto de turismo', value: 'turismo' },
                { label: 'visto de trabalho', value: 'trabalho' },
                { label: 'visto de transito',     value: 'transito' },
                { label: 'visto de estudo',     value: 'estudo' },
                { label: 'visto de tratamento médico', value: 'tratamento_medico' },
                {label: 'visto de  permanência temporária', value: 'permanencia_temporaria' },
                {label: 'Visto Diplomático, Oficial e de Cortesia', value: 'diplomatico' },
              ]}
            />
          </Box>
        </VStack>
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

        <Button disabled={isLoading} onClick={submeter} bg={'#d33434'} color={'white'} width={'100%'}>
          {isLoading ? <Spinner color={'white'} size={'sm'} marginRight={2} /> : t('submit')}
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