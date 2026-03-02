"use client"
import CustomCard from '@/components/custom/CustomCard'
import CustomECard from '@/components/custom/CustomECard'
import { Text, VStack } from '@chakra-ui/react'
import { AddressElement, CardElement, CardNumberElement, Elements, EmbeddedCheckout , LinkAuthenticationElement, PaymentElement, PaymentElementComponent } from '@stripe/react-stripe-js'
import Image from 'next/image'
import React from 'react'

export default function Pagamentos() {
  return (
    <VStack padding={10} bg={'#f6f6f6'} width={'100%'} height={'100%'}>
      <CustomCard link='portal/pagamentos' description='bwisi proprieties' title='Emolumentos' 
            icon={<Image src={'/icons/coin.svg'} alt='coin' width={50} height={50}/>}
             bg={'#f6f6f6'}>
              <VStack   alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={2} gap={4}>
                  
                  <Text fontSize={12} color={'gray'}>Pagamentos Recentes</Text>
                  <CustomECard/>
              </VStack>
            </CustomCard>
            <PaymentElement/>
    </VStack>
  )
}
