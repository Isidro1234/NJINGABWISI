'use client'

import { Box, Button, HStack, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import AvatarCustom from './AvatarCustom'
import Image from 'next/image'
import Logo from './Logo'
import { CustomDrawer } from './CustomDrawer'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Menu from "../../public/icons/menu-mobile.svg"

type NavbarProps = {
  islogged?: boolean
  name?: string
  image?: string
}

export default function Navbar({ islogged, image, name }: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('Navbar')

  const hideNavbar =
    pathname.includes('portal') || pathname.includes('messages')

  return (
    <HStack className="nav-bar" display={hideNavbar ? 'none' : 'flex'} _dark={{background:'#16171b'}}>
      <Logo />

      {/* Desktop Menu */}
      <Box className="Menu">
        <Text className="menu-item" _dark={{color:'#f6f6f6'}} cursor="pointer" onClick={() => router.push('/')}>
          {t('home')}
        </Text>

        <Text className="menu-item" _dark={{color:'#f6f6f6'}} cursor="pointer" onClick={() => router.push('/servicos')}>
          {t('services')}
        </Text>

        <Text className="menu-item" _dark={{color:'#f6f6f6'}} cursor="pointer" onClick={() => router.push('/quemsomos')}>
          {t('about')}
        </Text>

        <Text className="menu-item" _dark={{color:'#f6f6f6'}} cursor="pointer" onClick={() => router.push('/verifyuip')}>
          {t('verify')}
        </Text>
      </Box>

      {/* Mobile Menu */}
      <Box className="mobile-menu"  _dark={{background:"#13131500"}}>
        <CustomDrawer
          title={t('menu')}
          icon={
            <Menu
              width={30}
              height={30}
              fill={'gray'}
            />
          }
          content={
            <VStack>

              <Text className="menu-item" cursor="pointer" onClick={() => router.push('/')}>
                {t('home')}
              </Text>

              <Text className="menu-item" cursor="pointer" onClick={() => router.push('/servicos')}>
                {t('services')}
              </Text>

              <Text className="menu-item" cursor="pointer" onClick={() => router.push('/quemsomos')}>
                {t('about')}
              </Text>

              <Text className="menu-item" cursor="pointer" onClick={() => router.push('/verifyuip')}>
                {t('verify')}
              </Text>

              {!islogged && (
                <Box className="buttons-auth-mobile" gap={4} display="flex">
                  <Button
                    onClick={() => router.push('/auth/entrar')}
                    borderRadius={50}
                    color="#171717"
                    bg="#f6f6f6"
                  >
                    {t('login')}
                  </Button>

                  <Button
                    onClick={() => router.push('/auth/criarconta')}
                    borderRadius={50}
                    bg="red"
                    color="white"
                  >
                    {t('register')}
                  </Button>
                </Box>
              )}

              {islogged && (
                <Box className="buttons-auth-mobile" display="flex">
                  <AvatarCustom name={name || ''} image={image || ''} />
                </Box>
              )}

            </VStack>
          }
        />
      </Box>

      {/* Desktop Auth */}
      {!islogged && (
        <Box className="buttons-auth" gap={4} display="flex">
          <Button
            onClick={() => router.push('/auth/entrar')}
            borderRadius={50}
            color="#171717"
            bg="#f6f6f6"
          >
            {t('login')}
          </Button>

          <Button
            onClick={() => router.push('/auth/criarconta')}
            borderRadius={50}
            bg="red"
            color="white"
          >
            {t('register')}
          </Button>
        </Box>
      )}

      {islogged && (
        <Box className="buttons-auth" display="flex">
          <AvatarCustom name={name || ''} image={image || ''} />
        </Box>
      )}
    </HStack>
  )
}