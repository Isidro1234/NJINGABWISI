"use client"
import { CustomCaroussel } from '@/components/custom/CustomCaroussel'
import Footer from '@/components/structures/Footer'
import { Box, Button, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import React from 'react'

export default function Servicos() {
  const t = useTranslations('servicos')

  // ✅ titles and texts come from translations, not hardcoded
  const servicos = [
    { title: t('items.impostos_title'), text: t('items.impostos_text') },
    { title: t('items.registo_title'),  text: t('items.registo_text')  },
    { title: t('items.uip_title'),      text: t('items.uip_text')      },
  ]

  return (
    <VStack bg={'#da3d3d'} padding={0} gap={0} height={'100%'} width={'100%'}>
      <VStack width={'100%'}>
        <CustomCaroussel
          width={'100px'}
          items={[{ image: '/images/bicycle.jpg' }, { image: '/images/service1.jpg' }]}
        />
      </VStack>

      <HStack bg={'#da3d3d'} height={'100%'} alignItems={'flex-start'}
        padding={5} gap={5} flexWrap={'wrap'} width={'100%'}>
        <VStack bg={'#da3d3d'} height={'100%'} padding={5} paddingBottom={10} width={'100%'} gap={5}>

          <Heading color={'white'}>{t('title')}</Heading>

          <VStack height={'100%'} gap={4} maxWidth={1000} width={'100%'}
            display={'grid'} gridTemplateColumns={'repeat(auto-fit, minmax(300px, 1fr))'}>
            {servicos.map((item, index) => (
              <Box key={index} gap={2} bg={'white'} alignItems={'center'}
                display={'flex'} flexDirection={'column'} padding={5}
                borderRadius={10} borderWidth={1}>
                <Heading textAlign={'center'} color={'red'} fontSize={17}>
                  {item.title}
                </Heading>
                <Text textAlign={'center'} color={'gray'} fontSize={12}>
                  {item.text}
                </Text>
                <Button marginTop={2} bg={'#da3d3d'} borderRadius={50}>
                  {t('cta')}
                </Button>
              </Box>
            ))}
          </VStack>

        </VStack>
      </HStack>

      <Footer />
    </VStack>
  )
}