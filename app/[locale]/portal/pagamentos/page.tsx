"use client"
import CustomCard from '@/components/custom/CustomCard'
import CustomECard from '@/components/custom/CustomECard'
import { Toaster, toaster } from '@/components/ui/toaster'
import { Box, Button, HStack, Spinner, Text, VStack } from '@chakra-ui/react'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { decryptdata } from '@/logic/encryptdata'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

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

// ── Checkout form (inside Elements) ──────────────────────────────────────────
function CheckoutForm({ service, onSuccess, onCancel }: {
  service: Service
  onSuccess: () => void
  onCancel: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [paying, setPaying] = useState(false)

  async function handlePay(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return
    setPaying(true)
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      })
      if (error) {
        toaster.create({ title: error.message || 'Erro no pagamento', type: 'error', duration: 4000 })
      } else if (paymentIntent?.status === 'succeeded') {
        toaster.create({ title: 'Pagamento efectuado com sucesso!', type: 'success', duration: 4000 })
        onSuccess()
      }
    } catch (err: any) {
      toaster.create({ title: err.message, type: 'error', duration: 4000 })
    } finally {
      setPaying(false)
    }
  }

  return (
    <form onSubmit={handlePay} style={{ width: '100%' }}>
      <VStack gap={5} alignItems={'stretch'}>
        {/* Service summary */}
        <Box bg={'#f8faff'} borderRadius={12} padding={4} borderWidth={1} borderColor={'#e0e7ff'}>
          <HStack justifyContent={'space-between'}>
            <VStack alignItems={'flex-start'} gap={0}>
              <Text fontSize={14} fontWeight={700} color={'#0f1b35'}>{service.name}</Text>
              <Text fontSize={11} color={'#9ba3b8'}>{service.description}</Text>
            </VStack>
            <Text fontSize={18} fontWeight={800} color={'#3b5bdb'}>
              {(service.amount / 100).toFixed(2)} {service.currency.toUpperCase()}
            </Text>
          </HStack>
        </Box>

        <PaymentElement />

        <HStack gap={3}>
          <Button
            flex={1} borderRadius={10} fontSize={13}
            bg={'transparent'} borderWidth={1} borderColor={'#e5e7eb'}
            onClick={onCancel} type='button'
          >
            Cancelar
          </Button>
          <Button
            flex={2} borderRadius={10} fontSize={13}
            bg={'#3b5bdb'} color={'white'}
            type='submit' disabled={paying || !stripe}
            _hover={{ bg: '#2f4bc4' }}
          >
            {paying ? <Spinner size={'sm'} /> : `Pagar ${(service.amount / 100).toFixed(2)} ${service.currency.toUpperCase()}`}
          </Button>
        </HStack>
      </VStack>
    </form>
  )
}

// ── Main Pagamentos page ──────────────────────────────────────────────────────
export default function Pagamentos() {
  const t = useTranslations('portal.pagamentos')
  const [services, setServices] = useState<Service[]>([])
  const [fetching, setFetching] = useState(true)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loadingPayment, setLoadingPayment] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/services')
        const data = await res.json()
        setServices((data.services || []).filter((s: Service) => s.active))
      } catch (e) {
        console.error(e)
      } finally {
        setFetching(false)
      }
    }
    load()
  }, [])

  async function handleSelectService(service: Service) {
    setLoadingPayment(true)
    setSelectedService(service)
    try {
      const uip = localStorage.getItem('uip') || localStorage.getItem('uipadmin')
      const user = decryptdata(uip || '')
      const res = await fetch('/api/payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: service.priceId, userId: user?.id })
      })
      const data = await res.json()
      setClientSecret(data.client)
    } catch (e) {
      toaster.create({ title: 'Erro ao iniciar pagamento', type: 'error', duration: 4000 })
      setSelectedService(null)
    } finally {
      setLoadingPayment(false)
    }
  }

  function handleCancel() {
    setSelectedService(null)
    setClientSecret(null)
  }

  function handleSuccess() {
    setSelectedService(null)
    setClientSecret(null)
  }

  return (
    <VStack padding={{ base: 4, md: 10 }} bg={'#f6f6f6'} width={'100%'} minHeight={'100%'} gap={6}>
      <Toaster />

      

      {/* ── Services section ── */}
      <VStack width={'100%'} alignItems={'flex-start'} gap={4}>
        <VStack alignItems={'flex-start'} gap={0}>
          <Text fontSize={18} fontWeight={700} color={'#0f1b35'} letterSpacing={'-0.3px'}>
            Serviços Disponíveis
          </Text>
          <Text fontSize={12} color={'#9ba3b8'}>
            Seleccione um serviço para efectuar o pagamento
          </Text>
        </VStack>

        {fetching ? (
          <VStack width={'100%'} paddingTop={6} alignItems={'center'} gap={2}>
            <Spinner color={'#3b5bdb'} />
            <Text fontSize={12} color={'#9ba3b8'}>A carregar serviços...</Text>
          </VStack>
        ) : services.length === 0 ? (
          <VStack width={'100%'} paddingTop={6} alignItems={'center'} gap={2}>
            <Text fontSize={14} color={'#9ba3b8'}>Nenhum serviço disponível de momento</Text>
          </VStack>
        ) : (
          <Box
            width={'100%'}
            display={'grid'}
            gridTemplateColumns={{ base: '1fr', md: 'repeat(auto-fill, minmax(280px, 1fr))' }}
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
                borderColor={selectedService?.id === service.id ? '#3b5bdb' : '#eef0f5'}
                transition={'all 0.2s'}
                cursor={'pointer'}
                _hover={{ boxShadow: '0 6px 24px rgba(59,91,219,0.12)', transform: 'translateY(-2px)' }}
              >
                {service.image && (
                  <Box width={'100%'} height={'130px'} position={'relative'} overflow={'hidden'}>
                    <Image src={service.image} fill alt={service.name}
                      style={{ objectFit: 'cover' }} />
                  </Box>
                )}
                <VStack padding={5} alignItems={'flex-start'} gap={3}>
                  <VStack alignItems={'flex-start'} gap={0} width={'100%'}>
                    <Text fontSize={15} fontWeight={700} color={'#0f1b35'}>{service.name}</Text>
                    <Text fontSize={12} color={'#9ba3b8'} lineHeight={1.5} >
                      {service.description}
                    </Text>
                  </VStack>
                  <Text fontSize={22} fontWeight={800} color={'#3b5bdb'} letterSpacing={'-0.5px'}>
                    {(service.amount / 100).toFixed(2)}{' '}
                    <Text as={'span'} fontSize={13} fontWeight={500} color={'#9ba3b8'}>
                      {service.currency.toUpperCase()}
                    </Text>
                  </Text>
                  <Button
                    width={'100%'} borderRadius={10} fontSize={13}
                    bg={'#3b5bdb'} color={'white'}
                    onClick={() => handleSelectService(service)}
                    disabled={loadingPayment}
                    _hover={{ bg: '#2f4bc4' }}
                  >
                    {loadingPayment && selectedService?.id === service.id
                      ? <Spinner size={'sm'} />
                      : 'Pagar agora'
                    }
                  </Button>
                </VStack>
              </Box>
            ))}
          </Box>
        )}
      </VStack>

      {/* ── Payment modal ── */}
      {selectedService && clientSecret && (
        <Box
          position={'fixed'} inset={0} zIndex={9999}
          bg={'rgba(0,0,0,0.5)'}
          display={'flex'} alignItems={'center'} justifyContent={'center'}
          padding={4}
        >
          <Box
            bg={'white'} borderRadius={20} padding={{ base: 5, md: 7 }}
            width={'100%'} maxWidth={'480px'}
            boxShadow={'0 20px 60px rgba(0,0,0,0.2)'}
          >
            <HStack justifyContent={'space-between'} marginBottom={5}>
              <Text fontSize={16} fontWeight={700} color={'#0f1b35'}>
                Confirmar Pagamento
              </Text>
              <Button size={'sm'} borderRadius={'full'} bg={'transparent'}
                onClick={handleCancel}>
                ✕
              </Button>
            </HStack>

            <Elements
              stripe={stripePromise}
              options={{ clientSecret }}
            >
              <CheckoutForm
                service={selectedService}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
            </Elements>
          </Box>
        </Box>
      )}
    </VStack>
  )
}
