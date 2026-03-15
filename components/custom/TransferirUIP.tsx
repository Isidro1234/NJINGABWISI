'use client'
import { useLogicState } from '@/states/useLogicState'
import { toaster } from '@/components/ui/toaster'
import { Box, Button, HStack, Input, Spinner, Text, VStack } from '@chakra-ui/react'
import Image from 'next/image'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import SelectCustomValue from '@/components/custom/SelectCustomValue'
import SelecWithIcon from '@/components/custom/CustomSelectWithIcon'
import { useTranslations } from 'next-intl'
import { decryptdata } from '@/logic/encryptdata'

// ── Types ────────────────────────────────────────────────────────────────────
interface UIPUser {
  id: string
  nome: string
  uip: string
  photo?: string
 
}

interface TransferForm {
  imovel_id: string
  com_agente: 'sim' | 'nao' | ''
  uip_agente: string
  uip_comprador: string
  preco: string
  percentagem_agente: string
  percentagem_vendedor: string
}

interface Props {
  casas: Array<{
    ref: string ; nome: string; avatar?: string 
}>
}

// ── UIP Search Input ─────────────────────────────────────────────────────────
function UIPSearchInput({
  label,
  placeholder,
  value,
  onChange,
  searchFn,
  selectedLabel,
}: {
  label: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  searchFn: (query: string) => Promise<UIPUser[]>
  selectedLabel: (name: string) => string
}) {
  const [results, setResults] = useState<UIPUser[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<any | null>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  async function handleChange(v: string) {
    onChange(v)
    setSelected(null)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!v.trim() || v.length < 2) { setResults([]); setOpen(false); return }
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await searchFn(v)
        setResults(data)
        setOpen(data.length > 0)
      } catch (_) {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 350)
  }

  function handleSelect(user: UIPUser) {
    setSelected(user)
    onChange(user?.id)
    setResults([])
    setOpen(false)
  }

  return (
    <Box ref={containerRef} width={'100%'} position={'relative'}>
      <Text fontSize={11} fontWeight={500} color={'gray.500'} marginBottom={1}>{label}</Text>
      <Box
        display={'flex'} alignItems={'center'} borderWidth={1.5}
        borderColor={open ? 'blue.400' : 'gray.200'} borderRadius={10}
        overflow={'hidden'} bg={'white'} transition={'border-color 0.15s'}
        _focusWithin={{ borderColor: 'blue.400', boxShadow: '0 0 0 3px rgba(66,153,225,0.12)' }}
      >
        <Box width={9} display={'flex'} alignItems={'center'} justifyContent={'center'} flexShrink={0} paddingLeft={2}>
          {selected?.photo ? (
            <Box borderRadius={'full'} overflow={'hidden'} width={6} height={6} position={'relative'}>
              <Image src={selected.photo} fill alt={selected.nome} style={{ objectFit: 'cover' }} />
            </Box>
          ) : loading ? (
            <Spinner size={'xs'} color={'blue.400'} />
          ) : (
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <circle cx="9" cy="9" r="6" stroke="#9CA3AF" strokeWidth="1.5" />
              <path d="M15 15l3 3" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </Box>
        <Input
          border={'none'} outline={'none'} fontSize={12} placeholder={placeholder}
          value={value} onChange={(e) => handleChange(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          _focus={{ boxShadow: 'none' }} height={9} paddingX={2} bg={'transparent'}
        />
      </Box>

      {open && results.length > 0 && (
        <Box position={'absolute'} top={'calc(100% + 4px)'} left={0} right={0} zIndex={50}
          bg={'white'} borderRadius={10} borderWidth={1} borderColor={'gray.100'}
          boxShadow={'0 8px 24px rgba(0,0,0,0.10)'} overflow={'hidden'}
        >
          {results.map((user) => (
            <HStack key={user.id} padding={'8px 12px'} cursor={'pointer'}
              _hover={{ bg: 'blue.50' }} transition={'background 0.1s'}
              onClick={() => handleSelect(user)} gap={2}
            >
              {user?.photo ? (
                <Box borderRadius={'full'} overflow={'hidden'} width={7} height={7} position={'relative'} flexShrink={0}>
                  <Image src={user?.photo} fill alt={user.nome} style={{ objectFit: 'cover' }} />
                </Box>
              ) : (
                <Box width={7} height={7} borderRadius={'full'} bg={'blue.100'}
                  display={'flex'} alignItems={'center'} justifyContent={'center'} flexShrink={0}
                >
                  <Text fontSize={10} fontWeight={600} color={'blue.600'}>{user.nome?.charAt(0)?.toUpperCase()}</Text>
                </Box>
              )}
              <VStack gap={0} alignItems={'flex-start'} flex={1}>
                <Text fontSize={12} fontWeight={500} color={'gray.800'}>{user?.nome}</Text>
                <Text fontSize={10} color={'gray.400'}>{user.uip}</Text>
              </VStack>
            </HStack>
          ))}
        </Box>
      )}

      {selected && (
        <HStack marginTop={1} gap={1}>
          <Box width={2} height={2} borderRadius={'full'} bg={'green.400'} />
          <Text fontSize={10} color={'green.600'}>{selectedLabel(selected?.nome)}</Text>
        </HStack>
      )}
    </Box>
  )
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function TransferirUIP({ casas }: Props) {
  const t = useTranslations('transfer')
  const buscarUtente = useLogicState((state: any) => state.queryUserUIP)
  const submit_request = useLogicState((state: any) => state.vender_imovel)
  const [form, setForm] = useState<TransferForm>({
    imovel_id: casas?.[0]?.ref || '',
    com_agente: '',
    uip_agente: '',
    uip_comprador: '',
    preco: '',
    percentagem_agente: '',
    percentagem_vendedor: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const set = (field: keyof TransferForm) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const searchAgente = useCallback(async (query: string): Promise<UIPUser[]> => {
    try { return (await buscarUtente(query)) || [] } catch (_) { return [] }
  }, [buscarUtente])

  const searchComprador = useCallback(async (query: string): Promise<UIPUser[]> => {
    try { return (await buscarUtente(query)) || [] } catch (_) { return [] }
  }, [buscarUtente])
   const getuip = localStorage.getItem('uip');
   if(!getuip){return}
   const meu_uip= decryptdata(getuip)
  function validate(): string | null {
    if (!form.imovel_id) return t('error_imovel')
    if (!form.com_agente) return t('error_com_agente')
    if (form.com_agente === 'sim' && !form.uip_agente.trim()) return t('error_uip_agente')
    if (form.com_agente === 'sim' && !form.percentagem_agente.trim()) return t('error_pct_agente')
    if (!form.uip_comprador.trim()) return t('error_uip_comprador')
    if (!form.preco.trim()) return t('error_preco')
    if(form.uip_comprador === meu_uip?.id) return t('error_comprador_vendoro')
    if (isNaN(Number(form.preco.replace(/\s/g, '').replace(',', '.')))) return t('error_preco_invalid')
    if (!form.percentagem_vendedor.trim()) return t('error_pct_vendedor')
    const totalPct = Number(form.percentagem_agente || 0) + Number(form.percentagem_vendedor || 0)
    if (form.com_agente === 'sim' && totalPct > 100) return t('error_pct_total')
    return null
  }

  async function handleSubmit() {
    const error = validate()
    if (error) { toaster.create({ title: error, duration: 4000, type: 'error' }); return }
    const getuip = localStorage.getItem('uip');
    if(!getuip) return;
    const meu_uip = decryptdata(getuip);
    const res = 
    await submit_request(meu_uip, form.uip_agente , form.uip_comprador,
        form.preco, form.percentagem_vendedor, form.percentagem_agente, form.imovel_id)

    setSubmitting(true)
    try {
      toaster.create({ title: t('success'), duration: 4000, type: 'success' })
    } catch (_) {
      toaster.create({ title: t('error_submit'), duration: 5000, type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  const comAgente = form.com_agente === 'sim'

  return (
    <VStack width={'100%'} gap={4} alignItems={'flex-start'}>

      <Text fontSize={12} color={'gray.500'} lineHeight={1.5}>{t('hint')}</Text>

      {/* ── Row 1: Imóvel + Com agente ── */}
      <HStack width={'100%'} gap={3} alignItems={'flex-end'}>
        <Box flex={1}>
          <Text fontSize={11} fontWeight={500} color={'gray.500'} marginBottom={1}>{t('imovel_label')}</Text>
          <SelecWithIcon
            onChange={set('imovel_id')}
            items={casas.map((c: any) => ({ id: c?.ref, name: c?.formulario_imovel?.tipo_de_imovel + " " + c?.formulario_imovel?.utente_distrito, avatar: c?.formulario_imovel?.fotos_da_propriedade?.[0] || '' }))}
          />
        </Box>
        <Box flex={0.6}>
          <Text fontSize={11} fontWeight={500} color={'gray.500'} marginBottom={1}>{t('com_agente_label')}</Text>
          <SelectCustomValue
            width='100%' borderRadius={8}
            setChange={(e: any) => set('com_agente')(e[0])}
            items={[{ value: 'sim', label: t('sim') }, { value: 'nao', label: t('nao') }]}
          />
        </Box>
      </HStack>

      <Box width={'100%'} height={'1px'} bg={'gray.100'} />

      {/* ── Row 2: UIP search inputs ── */}
      <HStack width={'100%'} gap={3} alignItems={'flex-start'}>
        {comAgente && (
          <Box flex={1}>
            <UIPSearchInput
              label={t('uip_agente_label')}
              placeholder={t('uip_agente_placeholder')}
              value={form.uip_agente}
              onChange={set('uip_agente')}
              searchFn={searchAgente}
              selectedLabel={(name) => t('selected', { name })}
            />
          </Box>
        )}
        <Box flex={1}>
          <UIPSearchInput
            label={t('uip_comprador_label')}
            placeholder={t('uip_comprador_placeholder')}
            value={form.uip_comprador}
            onChange={set('uip_comprador')}
            searchFn={searchComprador}
            selectedLabel={(name) => t('selected', { name })}
          />
        </Box>
      </HStack>

      {/* ── Row 3: Preço ── */}
      <Box width={'100%'}>
        <Text fontSize={11} fontWeight={500} color={'gray.500'} marginBottom={1}>{t('preco_label')}</Text>
        <Box display={'flex'} alignItems={'center'} borderWidth={1.5} borderColor={'gray.200'}
          borderRadius={10} overflow={'hidden'} bg={'white'}
          _focusWithin={{ borderColor: 'blue.400', boxShadow: '0 0 0 3px rgba(66,153,225,0.12)' }}
          transition={'border-color 0.15s'}
        >
          <Box paddingX={3} height={'36px'} display={'flex'} alignItems={'center'}
            borderRightWidth={1} borderColor={'gray.100'} bg={'gray.50'} flexShrink={0}
          >
            <Text fontSize={11} color={'gray.400'} fontWeight={500}>{t('aoa')}</Text>
          </Box>
          <Input border={'none'} fontSize={12} placeholder={t('preco_placeholder')}
            value={form.preco} onChange={(e) => set('preco')(e.target.value)}
            _focus={{ boxShadow: 'none' }} height={9} paddingX={3} bg={'transparent'}
          />
        </Box>
      </Box>

      {/* ── Row 4: Percentagens ── */}
      <HStack width={'100%'} gap={3}>
        {comAgente && (
          <Box flex={1}>
            <Text fontSize={11} fontWeight={500} color={'gray.500'} marginBottom={1}>{t('pct_agente_label')}</Text>
            <Box display={'flex'} alignItems={'center'} borderWidth={1.5} borderColor={'gray.200'}
              borderRadius={10} overflow={'hidden'} bg={'white'}
              _focusWithin={{ borderColor: 'blue.400', boxShadow: '0 0 0 3px rgba(66,153,225,0.12)' }}
              transition={'border-color 0.15s'}
            >
              <Input border={'none'} fontSize={12} placeholder={t('pct_agente_placeholder')}
                value={form.percentagem_agente} onChange={(e) => set('percentagem_agente')(e.target.value)}
                _focus={{ boxShadow: 'none' }} height={9} paddingX={3} bg={'transparent'}
              />
              <Box paddingX={3} height={'36px'} display={'flex'} alignItems={'center'}
                borderLeftWidth={1} borderColor={'gray.100'} bg={'gray.50'} flexShrink={0}
              >
                <Text fontSize={11} color={'gray.400'} fontWeight={500}>%</Text>
              </Box>
            </Box>
          </Box>
        )}
        <Box flex={1}>
          <Text fontSize={11} fontWeight={500} color={'gray.500'} marginBottom={1}>{t('pct_vendedor_label')}</Text>
          <Box display={'flex'} alignItems={'center'} borderWidth={1.5} borderColor={'gray.200'}
            borderRadius={10} overflow={'hidden'} bg={'white'}
            _focusWithin={{ borderColor: 'blue.400', boxShadow: '0 0 0 3px rgba(66,153,225,0.12)' }}
            transition={'border-color 0.15s'}
          >
            <Input border={'none'} fontSize={12} placeholder={t('pct_vendedor_placeholder')}
              value={form.percentagem_vendedor} onChange={(e) => set('percentagem_vendedor')(e.target.value)}
              _focus={{ boxShadow: 'none' }} height={9} paddingX={3} bg={'transparent'}
            />
            <Box paddingX={3} height={'36px'} display={'flex'} alignItems={'center'}
              borderLeftWidth={1} borderColor={'gray.100'} bg={'gray.50'} flexShrink={0}
            >
              <Text fontSize={11} color={'gray.400'} fontWeight={500}>%</Text>
            </Box>
          </Box>
        </Box>
      </HStack>

      {/* ── Live summary ── */}
      {(form.preco || form.percentagem_vendedor || (comAgente && form.percentagem_agente)) && (
        <Box width={'100%'} bg={'blue.50'} borderRadius={10} padding={3} borderWidth={1} borderColor={'blue.100'}>
          <Text fontSize={11} fontWeight={600} color={'blue.700'} marginBottom={1}>{t('resumo_title')}</Text>
          {form.preco && (
            <Text fontSize={11} color={'blue.600'}>
              {t('resumo_preco')} <strong>{Number(form.preco.replace(/\s/g, '') || 0).toLocaleString('pt-AO')} {t('aoa')}</strong>
            </Text>
          )}
          {comAgente && form.percentagem_agente && form.preco && (
            <Text fontSize={11} color={'blue.600'}>
              {t('resumo_comissao', { pct: form.percentagem_agente })}{' '}
              <strong>{(Number(form.preco.replace(/\s/g, '')) * Number(form.percentagem_agente) / 100).toLocaleString('pt-AO')} {t('aoa')}</strong>
            </Text>
          )}
          {form.percentagem_vendedor && form.preco && (
            <Text fontSize={11} color={'blue.600'}>
              {t('resumo_vendedor', { pct: form.percentagem_vendedor })}{' '}
              <strong>{(Number(form.preco.replace(/\s/g, '')) * Number(form.percentagem_vendedor) / 100).toLocaleString('pt-AO')} {t('aoa')}</strong>
            </Text>
          )}
        </Box>
      )}

      {/* ── Submit ── */}
      <Button width={'100%'} bg={'blue.600'} color={'white'} borderRadius={10} fontSize={13}
        fontWeight={500} height={10} onClick={handleSubmit} disabled={submitting}
        _hover={{ bg: 'blue.700' }} transition={'background 0.15s'}
      >
        {submitting ? <Spinner size={'sm'} /> : t('submit')}
      </Button>
    </VStack>
  )
}
