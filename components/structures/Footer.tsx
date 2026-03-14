'use client'

import { Button, Heading, HStack, Stack, Text, VStack } from '@chakra-ui/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'

import Facebook from '../../public/icons/facebook.svg'
import Gmail from '../../public/icons/gmail.svg'
import Instagram from '../../public/icons/instagram.svg'
import Whatsapp from '../../public/icons/whatsapp.svg'

export default function Footer() {
  const pathname = usePathname()
  const t = useTranslations('Footer')

  return (
    <VStack
      width="100%"
      alignItems="flex-start"
      padding="24px 40px"
      borderTopWidth={1}
      backgroundColor="#1f1f1fff"
    >
      <HStack
        gap={15}
        alignItems="start"
        display="grid"
        gridTemplateColumns="repeat(auto-fit,minmax(100px, 1fr))"
        width="100%"
      >
        {/* Contacts */}
        <VStack alignItems="flex-start">
          <Heading fontSize={20} color="white">
            {t('contacts')}
          </Heading>

          <a href="mailto:info@bwisi.tech">
            <Text fontSize={12} color="#CECECE">info@bwisi.tech</Text>
          </a>

          <a href="tel:+244934590992">
            <Text fontSize={12} color="#CECECE">+244 934590992</Text>
          </a>

          <HStack gap={2} marginTop={2} flexWrap="wrap">
            <Button m={0} p={0} w={10} h={10} borderRadius={50}>
              <Facebook width="20px" height="20px" />
            </Button>

            <Button m={0} p={0} w={10} h={10} borderRadius={50}>
              <Instagram width={40} height={40} />
            </Button>

            <Button m={0} p={0} w={10} h={10} borderRadius={50}>
              <Whatsapp width={40} height={40} />
            </Button>

            <Button m={0} p={0} w={10} h={10} borderRadius={50}>
              <Gmail width={40} height={40} />
            </Button>
          </HStack>
        </VStack>

        {/* Terms */}
        <VStack alignItems="flex-start">
          <Heading color="white" fontSize={20}>
            {t('terms')}
          </Heading>

          <VStack alignItems="flex-start" gap={1}>
            <Link className="link-terms" href="/privacidade">
              {t('privacy')}
            </Link>

            <Link className="link-terms" href="/dados">
              {t('dataProtection')}
            </Link>

            <Link className="link-terms" href="/sobre-nos">
              {t('about')}
            </Link>
          </VStack>
        </VStack>

        {/* Services */}
        <VStack alignItems="flex-start">
          <Heading color="white" fontSize={20}>
            {t('services')}
          </Heading>

          <VStack alignItems="flex-start" gap={1}>
            <Stack direction="row">
              <Link className="link-terms" href="/plataformas">
                {t('piu')}
              </Link>
            </Stack>

            <Stack direction="row">
              <Link className="link-terms" href="/plataformas">
                {t('taxes')}
              </Link>
            </Stack>

            <Stack direction="row">
              <Link className="link-terms" href="/plataformas">
                {t('registration')}
              </Link>
            </Stack>
          </VStack>
        </VStack>
      </HStack>

      <hr style={{ color: 'gray', width: '100%' }} />

      <Text fontSize={10} textAlign="center" color="#CECECE">
        © {new Date().getFullYear()} Bwisi. {t('rights')}
      </Text>
    </VStack>
  )
}