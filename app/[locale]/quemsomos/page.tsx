import Footer from '@/components/structures/Footer'
import { Box, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import React from 'react'

export default async function Quemsomos() {
  const t = await getTranslations('quemsomos')

  return (
    <HStack position={'relative'} gap={0} height={'100%'} flexWrap={'wrap'}>
      <Box flex={1} minHeight={200} minWidth={200} position={'relative'} height={'100%'}>
        <Image
          fill
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          src={'/images/image-1.jpg'}
          alt='image'
        />
      </Box>

      <VStack position={'absolute'} minWidth={10} bg={'#490c0c'} padding={5}
        alignItems={'flex-start'} height={300} maxWidth={300} width={'100%'}>
        <Heading fontSize={25} color={'white'}>{t('title')}</Heading>
        <Text fontSize={12} color={'white'}>{t('body')}</Text>
      </VStack>

      <Footer />
    </HStack>
  )
}