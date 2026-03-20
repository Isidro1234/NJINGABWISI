"use client"
import { Box, Button, HStack, Input, Spinner, Text, Textarea, VStack } from '@chakra-ui/react'
import { Toaster, toaster } from '@/components/ui/toaster'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import SelectCustomValue from '@/components/custom/SelectCustomValue'

interface Service {
  id: string
  name: string
  description: string
  amount: number
  currency: string
  priceId: string
  active: boolean
  image?: string
}

interface ServiceForm {
  name: string
  description: string
  amount: string
  currency: string
  image: string
}

export default function Pagamentoscollab() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<ServiceForm>({
    name: '',
    description: '',
    amount: '',
    currency: 'usd',
    image: '',
  })

  useEffect(() => {
    loadServices()
  }, [])

  async function loadServices() {
    setFetching(true)
    try {
      const res = await fetch('/api/services')
      const data = await res.json()
      setServices(data.services || [])
    } catch (e) {
      console.error(e)
    } finally {
      setFetching(false)
    }
  }

  const set = (field: keyof ServiceForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  async function createService() {
    if (!form.name || !form.amount || !form.description) {
      toaster.create({ title: 'Preencha todos os campos', type: 'error', duration: 3000 })
      return
    }
    if (isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      toaster.create({ title: 'Valor inválido', type: 'error', duration: 3000 })
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          amount: Math.round(Number(form.amount) * 100), // convert to cents
          currency: form.currency,
          image: form.image || null,
        })
      })
      if (!res.ok) throw new Error('Failed to create service')
      toaster.create({ title: 'Serviço criado com sucesso', type: 'success', duration: 3000 })
      setForm({ name: '', description: '', amount: '', currency: 'usd', image: '' })
      setShowForm(false)
      await loadServices()
    } catch (e: any) {
      toaster.create({ title: 'Erro ao criar serviço', description: e.message, type: 'error', duration: 4000 })
    } finally {
      setLoading(false)
    }
  }

  async function toggleService(serviceId: string, active: boolean) {
    try {
      await fetch('/api/services', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId, active: !active })
      })
      await loadServices()
      toaster.create({
        title: active ? 'Serviço desactivado' : 'Serviço activado',
        type: 'success', duration: 2000
      })
    } catch (e) {
      toaster.create({ title: 'Erro ao actualizar serviço', type: 'error', duration: 3000 })
    }
  }

  async function deleteService(serviceId: string) {
    try {
      await fetch(`/api/services?id=${serviceId}`, { method: 'DELETE' })
      await loadServices()
      toaster.create({ title: 'Serviço eliminado', type: 'success', duration: 2000 })
    } catch (e) {
      toaster.create({ title: 'Erro ao eliminar', type: 'error', duration: 3000 })
    }
  }

  return (
    <VStack
      width={'100%'}
      minHeight={'100vh'}
      bg={'#f6f6f6'}
      padding={{ base: 4, md: 8 }}
      gap={6}
      alignItems={'flex-start'}
    >
      <Toaster />

      {/* ── Header ── */}
      <HStack width={'100%'} justifyContent={'space-between'} flexWrap={'wrap'} gap={3}>
        <VStack alignItems={'flex-start'} gap={0}>
          <Text fontSize={{ base: 20, md: 24 }} fontWeight={700} color={'#0f1b35'}
            letterSpacing={'-0.5px'}>
            Serviços & Pagamentos
          </Text>
          <Text fontSize={12} color={'#9ba3b8'}>
            Gerir serviços disponíveis para pagamento
          </Text>
        </VStack>
        <Button
          bg={'#3b5bdb'} color={'white'} borderRadius={10}
          fontSize={13} fontWeight={500} paddingX={5}
          onClick={() => setShowForm(!showForm)}
          _hover={{ bg: '#2f4bc4' }}
        >
          {showForm ? '− Fechar' : '+ Novo Serviço'}
        </Button>
      </HStack>

      {/* ── Create form ── */}
      {showForm && (
        <Box
          width={'100%'}
          bg={'white'}
          borderRadius={16}
          padding={{ base: 5, md: 7 }}
          boxShadow={'0 4px 20px rgba(0,0,0,0.07)'}
          borderWidth={1}
          borderColor={'#eef0f5'}
        >
          <Text fontSize={15} fontWeight={700} color={'#0f1b35'} marginBottom={5}>
            Criar Novo Serviço
          </Text>
          <VStack gap={4} alignItems={'stretch'}>

            {/* Row 1 */}
            <HStack gap={4} flexWrap={{ base: 'wrap', md: 'nowrap' }}>
              <VStack alignItems={'flex-start'} gap={1} flex={1} minWidth={'200px'}>
                <Text fontSize={11} fontWeight={500} color={'#6b7280'}>Nome do serviço *</Text>
                <Input
                  value={form.name}
                  onChange={set('name')}
                  placeholder={'Ex: Registo de Imóvel'}
                  borderRadius={10} fontSize={13}
                  borderColor={'#e5e7eb'}
                  _focus={{ borderColor: '#3b5bdb', boxShadow: '0 0 0 3px rgba(59,91,219,0.1)' }}
                />
              </VStack>
              <VStack alignItems={'flex-start'} gap={1} width={{ base: '100%', md: '180px' }}>
                <Text fontSize={11} fontWeight={500} color={'#6b7280'}>Valor *</Text>
                <HStack width={'100%'} gap={0} borderWidth={1} borderColor={'#e5e7eb'}
                  borderRadius={10} overflow={'hidden'}
                  _focusWithin={{ borderColor: '#3b5bdb', boxShadow: '0 0 0 3px rgba(59,91,219,0.1)' }}>
                  <Box paddingX={3} bg={'#f9fafb'} height={'40px'} display={'flex'}
                    alignItems={'center'} borderRight={'1px solid #e5e7eb'} flexShrink={0}>
                    <Text fontSize={12} color={'#6b7280'} fontWeight={500}>$</Text>
                  </Box>
                  <Input border={'none'} value={form.amount} onChange={set('amount')}
                    placeholder={'0.00'} fontSize={13} _focus={{ boxShadow: 'none' }} />
                </HStack>
              </VStack>
              <VStack alignItems={'flex-start'} gap={1} width={{ base: '100%', md: '130px' }}>
                <Text fontSize={11} fontWeight={500} color={'#6b7280'}>Moeda</Text>
                <SelectCustomValue items={[{value:'USD', label:'USD'},
                  {value:'EUR', label:'EUR'},{value:'AOA', label:'AOA'}
                ]}
                 borderRadius={10}
                  setChange={(e:any)=>{set(e[0])}}
                  width={'100%'}
                 
                />
              </VStack>
            </HStack>

            {/* Row 2 */}
            <VStack alignItems={'flex-start'} gap={1}>
              <Text fontSize={11} fontWeight={500} color={'#6b7280'}>Descrição *</Text>
              <Textarea
                value={form.description}
                onChange={set('description')}
                placeholder={'Descreva o serviço...'}
                rows={3}
                width={'100%'}
                borderWidth={1} borderColor={'#e5e7eb'} borderRadius={10}
                fontSize={13} padding={'10px 14px'} bg={'white'} color={'#0f1b35'}
                resize={'vertical'}
                style={{ outline: 'none', fontFamily: 'inherit', lineHeight: 1.6 }}
                _focus={{ borderColor: '#3b5bdb' }}
              />
            </VStack>

            {/* Row 3 - image url */}
            <VStack alignItems={'flex-start'} gap={1}>
              <Text fontSize={11} fontWeight={500} color={'#6b7280'}>URL da imagem (opcional)</Text>
              <Input
                value={form.image}
                onChange={set('image')}
                placeholder={'https://...'}
                borderRadius={10} fontSize={13}
                borderColor={'#e5e7eb'}
                _focus={{ borderColor: '#3b5bdb', boxShadow: '0 0 0 3px rgba(59,91,219,0.1)' }}
              />
            </VStack>

            <HStack justifyContent={'flex-end'} gap={3}>
              <Button
                borderRadius={10} fontSize={13} bg={'transparent'}
                borderWidth={1} borderColor={'#e5e7eb'}
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </Button>
              <Button
                borderRadius={10} fontSize={13} bg={'#3b5bdb'} color={'white'}
                onClick={createService} disabled={loading}
                _hover={{ bg: '#2f4bc4' }} minWidth={'120px'}
              >
                {loading ? <Spinner size={'sm'} /> : 'Criar Serviço'}
              </Button>
            </HStack>
          </VStack>
        </Box>
      )}

      {/* ── Services list ── */}
      {fetching ? (
        <VStack width={'100%'} paddingTop={10} alignItems={'center'}>
          <Spinner color={'#3b5bdb'} />
          <Text fontSize={12} color={'#9ba3b8'}>A carregar serviços...</Text>
        </VStack>
      ) : services.length === 0 ? (
        <VStack width={'100%'} paddingTop={10} alignItems={'center'} gap={3}>
          <Box width={'60px'} height={'60px'} borderRadius={'full'} bg={'#eef1ff'}
            display={'flex'} alignItems={'center'} justifyContent={'center'}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                fill="#3b5bdb" />
            </svg>
          </Box>
          <Text fontSize={14} fontWeight={600} color={'#0f1b35'}>Nenhum serviço criado</Text>
          <Text fontSize={12} color={'#9ba3b8'}>Clique em "Novo Serviço" para começar</Text>
        </VStack>
      ) : (
        <Box
          width={'100%'}
          display={'grid'}
          gridTemplateColumns={'repeat(auto-fill, minmax(300px, 1fr))'}
          gap={4}
        >
          {services.map((service) => (
            <Box
              key={service.id}
              bg={'white'}
              borderRadius={16}
              overflow={'hidden'}
              boxShadow={'0 2px 12px rgba(0,0,0,0.06)'}
              borderWidth={1}
              borderColor={service.active ? '#eef0f5' : '#fee2e2'}
              opacity={service.active ? 1 : 0.7}
              transition={'all 0.2s'}
            >
              {/* Service image */}
              {service.image && (
                <Box width={'100%'} height={'140px'} position={'relative'} overflow={'hidden'}>
                  <Image src={service.image} fill alt={service.name}
                    style={{ objectFit: 'cover' }} />
                </Box>
              )}

              <VStack padding={5} alignItems={'flex-start'} gap={3}>
                <HStack width={'100%'} justifyContent={'space-between'} alignItems={'flex-start'}>
                  <VStack alignItems={'flex-start'} gap={0} flex={1} overflow={'hidden'}>
                    <Text fontSize={15} fontWeight={700} color={'#0f1b35'} >
                      {service.name}
                    </Text>
                    <Text fontSize={11} color={'#9ba3b8'}  lineHeight={1.5}>
                      {service.description}
                    </Text>
                  </VStack>
                  <Box
                    paddingX={2} paddingY={1} borderRadius={6}
                    bg={service.active ? '#dcfce7' : '#fee2e2'}
                    flexShrink={0} marginLeft={2}
                  >
                    <Text fontSize={10} fontWeight={600}
                      color={service.active ? '#16a34a' : '#dc2626'}>
                      {service.active ? 'Activo' : 'Inactivo'}
                    </Text>
                  </Box>
                </HStack>

                {/* Price */}
                <Text fontSize={20} fontWeight={800} color={'#3b5bdb'} letterSpacing={'-0.5px'}>
                  {(service.amount / 100).toFixed(2)} {service.currency.toUpperCase()}
                </Text>

                {/* Price ID */}
                <Text fontSize={9} color={'#c4c9d4'} fontFamily={'monospace'}>
                  {service.priceId}
                </Text>

                {/* Actions */}
                <HStack width={'100%'} gap={2} marginTop={1}>
                  <Button
                    flex={1} borderRadius={8} fontSize={12}
                    bg={service.active ? '#fff7ed' : '#f0fdf4'}
                    color={service.active ? '#ea580c' : '#16a34a'}
                    borderWidth={1}
                    borderColor={service.active ? '#fed7aa' : '#bbf7d0'}
                    onClick={() => toggleService(service.id, service.active)}
                    _hover={{ opacity: 0.8 }}
                  >
                    {service.active ? 'Desactivar' : 'Activar'}
                  </Button>
                  <Button
                    borderRadius={8} fontSize={12}
                    bg={'#fff1f2'} color={'#e11d48'}
                    borderWidth={1} borderColor={'#fecdd3'}
                    onClick={() => deleteService(service.id)}
                    _hover={{ opacity: 0.8 }}
                    paddingX={4}
                  >
                    Eliminar
                  </Button>
                </HStack>
              </VStack>
            </Box>
          ))}
        </Box>
      )}
    </VStack>
  )
}
