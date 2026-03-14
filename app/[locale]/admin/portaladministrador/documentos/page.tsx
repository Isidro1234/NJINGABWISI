
"use client"
import CustomCard from '@/components/custom/CustomCard'
import { Text } from '@chakra-ui/react'
import React from 'react'
import { useTranslations } from 'next-intl'

export default function Documentos() {

  const t = useTranslations('documentos')

  return (
    <div>
      <CustomCard>
        <Text>{t('helloWorld')}</Text>
      </CustomCard>
    </div>
  )
}

