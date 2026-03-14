'use client'
import { useLogicState } from '@/states/useLogicState'
import { toaster } from '@/components/ui/toaster'
import { Box, Button, HStack, Input, Spinner, Text, VStack } from '@chakra-ui/react'
import Image from 'next/image'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import SelectCustomValue from '@/components/custom/SelectCustomValue'
import SelecWithIcon from '@/components/custom/CustomSelectWithIcon'

// ── Types ────────────────────────────────────────────────────────────────────
interface UIPUser {
  id: string
  nome: string
  uip: string
  avatar?: string
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
  casas: Array<{ id: string; nome: string; avatar?: string }>
}

// ── UIP Search Input ─────────────────────────────────────────────────────────
function UIPSearchInput({
  label,
  placeholder,
  value,
  onChange,
  searchFn,
}: {
  label: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  searchFn: (query: string) => Promise<UIPUser[]>
}) {
  const [results, setResults] = useState<UIPUser[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<UIPUser | null>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
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
    onChange(user.uip)
    setResults([])
    setOpen(false)
  }

  return (
    <Box ref={containerRef} width={'100%'} position={'relative'}>
      {/* Label */}
      <Text fontSize={11} fontWeight={500} color={'gray.500'} marginBottom={1}>{label}</Text>

      {/* Input row */}
      <Box
        display={'flex'}
        alignItems={'center'}
        borderWidth={1.5}
        borderColor={open ? 'blue.400' : 'gray.200'}
        borderRadius={10}
        overflow={'hidden'}
        bg={'white'}
        transition={'border-color 0.15s'}
        _focusWithin={{ borderColor: 'blue.400', boxShadow: '0 0 0 3px rgba(66,153,225,0.12)' }}
      >
        {/* Selected avatar or search icon */}
        <Box
          width={9}
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          flexShrink={0}
          paddingLeft={2}
        >
          {selected?.avatar ? (
            <Box borderRadius={'full'} overflow={'hidden'} width={6} height={6} position={'relative'}>
              <Image src={selected.avatar} fill alt={selected.nome} style={{ objectFit: 'cover' }} />
            </Box>
          ) : loading ? (
            <Spinner size={'xs'} color={'blue.400'} />
          ) : (
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <circle cx="9" cy="9" r="6" stroke="#9CA3AF" strokeWidth="1.5"/>
              <path d="M15 15l3 3" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          )}
        </Box>

        <Input
          border={'none'}
          outline={'none'}
          fontSize={12}
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          _focus={{ boxShadow: 'none' }}
          height={9}
          paddingX={2}
          bg={'transparent'}
        />
      </Box>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <Box
          position={'absolute'}
          top={'calc(100% + 4px)'}
          left={0}
          right={0}
          zIndex={50}
          bg={'white'}
          borderRadius={10}
          borderWidth={1}
          borderColor={'gray.100'}
          boxShadow={'0 8px 24px rgba(0,0,0,0.10)'}
          overflow={'hidden'}
        >
          {results.map((user) => (
            <HStack
              key={user.id}
              padding={'8px 12px'}
              cursor={'pointer'}
              _hover={{ bg: 'blue.50' }}
              transition={'background 0.1s'}
              onClick={() => handleSelect(user)}
              gap={2}
            >
              {user.avatar ? (
                <Box borderRadius={'full'} overflow={'hidden'} width={7} height={7} position={'relative'} flexShrink={0}>
                  <Image src={user.avatar} fill alt={user.nome} style={{ objectFit: 'cover' }} />
                </Box>
              ) : (
                <Box
                  width={7} height={7} borderRadius={'full'} bg={'blue.100'}
                  display={'flex'} alignItems={'center'} justifyContent={'center'}
                  flexShrink={0}
                >
                  <Text fontSize={10} fontWeight={600} color={'blue.600'}>
                    {user.nome?.charAt(0)?.toUpperCase()}
                  </Text>
                </Box>
              )}
              <VStack gap={0} alignItems={'flex-start'} flex={1}>
                <Text fontSize={12} fontWeight={500} color={'gray.800'}>{user.nome}</Text>
                <Text fontSize={10} color={'gray.400'}>{user.uip}</Text>
              </VStack>
            </HStack>
          ))}
        </Box>
      )}

      {/* Selected user chip */}
      {selected && (
        <HStack marginTop={1} gap={1}>
          <Box width={2} height={2} borderRadius={'full'} bg={'green.400'} />
          <Text fontSize={10} color={'green.600'}>{selected.nome} seleccionado</Text>
        </HStack>
      )}
    </Box>
  )
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function TransferirUIP({ casas }: Props) {
  const buscarUtente = useLogicState((state: any) => state.queryUserUIP)

  const [form, setForm] = useState<TransferForm>({
    imovel_id: casas?.[0]?.id || '',
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

  // ── Search functions ────────────────────────────────────────────────────────
  const searchAgente = useCallback(async (query: string): Promise<UIPUser[]> => {
    try {
      const res = await buscarUtente(query)
      console.log(res)
      return res || []
    } catch (_) { return [] }
  }, [buscarUtente])

  const searchComprador = useCallback(async (query: string): Promise<UIPUser[]> => {
    try {
      const res = await buscarUtente(query)
      return res || []
    } catch (_) { return [] }
  }, [buscarUtente])

  // ── Validation ──────────────────────────────────────────────────────────────
  function validate(): string | null {
    if (!form.imovel_id) return 'Seleccione um imóvel'
    if (!form.com_agente) return 'Indique se a transferência é com agente'
    if (form.com_agente === 'sim' && !form.uip_agente.trim())
      return 'UIP do agente é obrigatório'
    if (form.com_agente === 'sim' && !form.percentagem_agente.trim())
      return 'Percentagem do agente é obrigatória'
    if (!form.uip_comprador.trim()) return 'UIP do comprador é obrigatório'
    if (!form.preco.trim()) return 'Preço do imóvel é obrigatório'
    if (isNaN(Number(form.preco.replace(/\s/g, '').replace(',', '.'))))
      return 'Preço inválido — introduza apenas números'
    if (!form.percentagem_vendedor.trim()) return 'Percentagem do vendedor é obrigatória'
    const totalPct =
      Number(form.percentagem_agente || 0) + Number(form.percentagem_vendedor || 0)
    if (form.com_agente === 'sim' && totalPct > 100)
      return 'A soma das percentagens não pode exceder 100%'
    return null
  }

  async function handleSubmit() {
    const error = validate()
    if (error) {
      toaster.create({ title: error, duration: 4000, type: 'error' })
      return
    }
    setSubmitting(true)
    try {
      toaster.create({ title: 'Pedido de transferência submetido com sucesso', duration: 4000, type: 'success' })
    } catch (_) {
      toaster.create({ title: 'Erro ao submeter. Verifique a sua ligação.', duration: 5000, type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  const comAgente = form.com_agente === 'sim'

  return (
    <VStack width={'100%'} gap={4} alignItems={'flex-start'}>

      {/* Header hint */}
      <Text fontSize={12} color={'gray.500'} lineHeight={1.5}>
        Preencha os dados abaixo para iniciar o processo de transferência do seu imóvel.
      </Text>

      {/* ── Row 1: Imóvel + Com agente ── */}
      <HStack width={'100%'} gap={3} alignItems={'flex-end'}>
        <Box flex={1}>
          <Text fontSize={11} fontWeight={500} color={'gray.500'} marginBottom={1}>Imóvel a transferir</Text>
          <SelecWithIcon
            onChange={set('imovel_id')}
            items={casas.map((c:any) => ({ id: c?.id, name: c?.formulario_imovel?.tipo_de_imovel + " " + c?.formulario_imovel?.utente_distrito, avatar: c?.formulario_imovel?.fotos_da_propriedade?.[0] || '' }))}
          />
        </Box>
        <Box flex={0.6}>
          <Text fontSize={11} fontWeight={500} color={'gray.500'} marginBottom={1}>Com agente?</Text>
          <SelectCustomValue
            width='100%'
            borderRadius={8}
            setChange={(e: any) => set('com_agente')(e[0])}
            items={[{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não' }]}
          />
        </Box>
      </HStack>

      {/* ── Divider ── */}
      <Box width={'100%'} height={'1px'} bg={'gray.100'} />

      {/* ── Row 2: UIP search inputs ── */}
      <HStack width={'100%'} gap={3} alignItems={'flex-start'}>
        {comAgente && (
          <Box flex={1}>
            <UIPSearchInput
              label='UIP do Agente'
              placeholder='Pesquisar agente pelo nome ou UIP...'
              value={form.uip_agente}
              onChange={set('uip_agente')}
              searchFn={searchAgente}
            />
          </Box>
        )}
        <Box flex={1}>
          <UIPSearchInput
            label='UIP do Comprador'
            placeholder='Pesquisar comprador pelo nome ou UIP...'
            value={form.uip_comprador}
            onChange={set('uip_comprador')}
            searchFn={searchComprador}
          />
        </Box>
      </HStack>

      {/* ── Row 3: Preço ── */}
      <Box width={'100%'}>
        <Text fontSize={11} fontWeight={500} color={'gray.500'} marginBottom={1}>Preço do Imóvel (AOA)</Text>
        <Box
          display={'flex'}
          alignItems={'center'}
          borderWidth={1.5}
          borderColor={'gray.200'}
          borderRadius={10}
          overflow={'hidden'}
          bg={'white'}
          _focusWithin={{ borderColor: 'blue.400', boxShadow: '0 0 0 3px rgba(66,153,225,0.12)' }}
          transition={'border-color 0.15s'}
        >
          <Box
            paddingX={3}
            height={'36px'}
            display={'flex'}
            alignItems={'center'}
            borderRightWidth={1}
            borderColor={'gray.100'}
            bg={'gray.50'}
            flexShrink={0}
          >
            <Text fontSize={11} color={'gray.400'} fontWeight={500}>AOA</Text>
          </Box>
          <Input
            border={'none'}
            fontSize={12}
            placeholder='Ex: 15 000 000'
            value={form.preco}
            onChange={(e) => set('preco')(e.target.value)}
            _focus={{ boxShadow: 'none' }}
            height={9}
            paddingX={3}
            bg={'transparent'}
          />
        </Box>
      </Box>

      {/* ── Row 4: Percentagens ── */}
      <HStack width={'100%'} gap={3}>
        {comAgente && (
          <Box flex={1}>
            <Text fontSize={11} fontWeight={500} color={'gray.500'} marginBottom={1}>% Agente</Text>
            <Box
              display={'flex'}
              alignItems={'center'}
              borderWidth={1.5}
              borderColor={'gray.200'}
              borderRadius={10}
              overflow={'hidden'}
              bg={'white'}
              _focusWithin={{ borderColor: 'blue.400', boxShadow: '0 0 0 3px rgba(66,153,225,0.12)' }}
              transition={'border-color 0.15s'}
            >
              <Input
                border={'none'}
                fontSize={12}
                placeholder='Ex: 5'
                value={form.percentagem_agente}
                onChange={(e) => set('percentagem_agente')(e.target.value)}
                _focus={{ boxShadow: 'none' }}
                height={9}
                paddingX={3}
                bg={'transparent'}
              />
              <Box
                paddingX={3}
                height={'36px'}
                display={'flex'}
                alignItems={'center'}
                borderLeftWidth={1}
                borderColor={'gray.100'}
                bg={'gray.50'}
                flexShrink={0}
              >
                <Text fontSize={11} color={'gray.400'} fontWeight={500}>%</Text>
              </Box>
            </Box>
          </Box>
        )}
        <Box flex={1}>
          <Text fontSize={11} fontWeight={500} color={'gray.500'} marginBottom={1}>% Vendedor</Text>
          <Box
            display={'flex'}
            alignItems={'center'}
            borderWidth={1.5}
            borderColor={'gray.200'}
            borderRadius={10}
            overflow={'hidden'}
            bg={'white'}
            _focusWithin={{ borderColor: 'blue.400', boxShadow: '0 0 0 3px rgba(66,153,225,0.12)' }}
            transition={'border-color 0.15s'}
          >
            <Input
              border={'none'}
              fontSize={12}
              placeholder='Ex: 95'
              value={form.percentagem_vendedor}
              onChange={(e) => set('percentagem_vendedor')(e.target.value)}
              _focus={{ boxShadow: 'none' }}
              height={9}
              paddingX={3}
              bg={'transparent'}
            />
            <Box
              paddingX={3}
              height={'36px'}
              display={'flex'}
              alignItems={'center'}
              borderLeftWidth={1}
              borderColor={'gray.100'}
              bg={'gray.50'}
              flexShrink={0}
            >
              <Text fontSize={11} color={'gray.400'} fontWeight={500}>%</Text>
            </Box>
          </Box>
        </Box>
      </HStack>

      {/* ── Live summary ── */}
      {(form.preco || form.percentagem_vendedor || (comAgente && form.percentagem_agente)) && (
        <Box
          width={'100%'}
          bg={'blue.50'}
          borderRadius={10}
          padding={3}
          borderWidth={1}
          borderColor={'blue.100'}
        >
          <Text fontSize={11} fontWeight={600} color={'blue.700'} marginBottom={1}>Resumo</Text>
          {form.preco && (
            <Text fontSize={11} color={'blue.600'}>
              Preço: <strong>{Number(form.preco.replace(/\s/g, '') || 0).toLocaleString('pt-AO')} AOA</strong>
            </Text>
          )}
          {comAgente && form.percentagem_agente && form.preco && (
            <Text fontSize={11} color={'blue.600'}>
              Comissão agente ({form.percentagem_agente}%):{' '}
              <strong>
                {(Number(form.preco.replace(/\s/g, '')) * Number(form.percentagem_agente) / 100).toLocaleString('pt-AO')} AOA
              </strong>
            </Text>
          )}
          {form.percentagem_vendedor && form.preco && (
            <Text fontSize={11} color={'blue.600'}>
              Valor vendedor ({form.percentagem_vendedor}%):{' '}
              <strong>
                {(Number(form.preco.replace(/\s/g, '')) * Number(form.percentagem_vendedor) / 100).toLocaleString('pt-AO')} AOA
              </strong>
            </Text>
          )}
        </Box>
      )}

      {/* ── Submit ── */}
      <Button
        width={'100%'}
        bg={'blue.600'}
        color={'white'}
        borderRadius={10}
        fontSize={13}
        fontWeight={500}
        height={10}
        onClick={handleSubmit}
        disabled={submitting}
        _hover={{ bg: 'blue.700' }}
        transition={'background 0.15s'}
      >
        {submitting ? <Spinner size={'sm'} /> : 'Submeter pedido de Transferência'}
      </Button>
    </VStack>
  )
}
