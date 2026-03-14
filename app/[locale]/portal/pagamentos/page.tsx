"use client"
import CustomCard from '@/components/custom/CustomCard'
import CustomECard from '@/components/custom/CustomECard'
import { Text, VStack } from '@chakra-ui/react'
import { PaymentElement } from '@stripe/react-stripe-js'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React from 'react'

export default function Pagamentos() {
  const t = useTranslations('portal.pagamentos')

  return (
    <VStack padding={10} bg={'#f6f6f6'} width={'100%'} height={'100%'}>
      <CustomCard
        link='portal/pagamentos'
        description={t('description')}
        title={t('title')}
        icon={<Image src={'/icons/coin.svg'} alt='coin' width={50} height={50} />}
        bg={'#f6f6f6'}
      >
        <VStack alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={2} gap={4}>
          <Text fontSize={12} color={'gray'}>{t('recent_payments')}</Text>
          <CustomECard />
        </VStack>
      </CustomCard>
      <PaymentElement />
    </VStack>
  )
}