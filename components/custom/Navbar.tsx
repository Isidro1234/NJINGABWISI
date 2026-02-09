'use client'
import { Box, Button, HStack, Input, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import AvatarCustom from './AvatarCustom'
import Link from 'next/link'
import Image from 'next/image'
import Logo from './Logo'
import { CustomDrawer } from './CustomDrawer'
type custom<T> = {
   islogged: boolean | null,
   name : string | null ,
   image: string | null
}

export default function Navbar<T>({islogged, image, name}:custom<T>) {
  return (
    <HStack className='nav-bar'>
        <Logo/>
        <Box className='Menu'>
          <Link href={''}><Text className='menu-item'>Pagina Inicial</Text></Link>
          <Link href={''}><Text className='menu-item'>Servicos</Text></Link>
          <Link href={''}><Text className='menu-item'>Quem somos</Text></Link>
          <Link href={''}><Text className='menu-item'>Verificar PIU/UIP</Text></Link>

        </Box>
        <Box className='mobile-menu'>
          <CustomDrawer
          title={'Menu'}
          icon={<Image width={30} height={30} alt='menu-mobile' src={'/icons/menu-mobile.svg'}/>}
          content={<VStack>
            <Link href={''}><Text className='menu-item'>Pagina Inicial</Text></Link>
          <Link href={''}><Text className='menu-item'>Servicos</Text></Link>
          <Link href={''}><Text className='menu-item'>Quem somos</Text></Link>
          <Link href={''}><Text className='menu-item'>Verificar PIU/UIP</Text></Link>
          <Box className='buttons-auth-mobile'  gap={4} display={!islogged ? 'flex' : 'none'}>
            <Button borderRadius={50} color={'#171717'} bg={'#f6f6f6'}>Entrar</Button>
            <Button  borderRadius={50} bg={'red'} color={'white'}>Registrar</Button>
          </Box>
          <Box className='buttons-auth-mobile'  display={islogged ? 'flex' : 'none'}>
            <AvatarCustom name={name || ''} image={image || ''}/>
          </Box>
          </VStack>}
          />
        </Box>
        <Box className='buttons-auth'  gap={4} display={!islogged ? 'flex' : 'none'}>
            <Button borderRadius={50} color={'#171717'} bg={'#f6f6f6'}>Entrar</Button>
            <Button  borderRadius={50} bg={'red'} color={'white'}>Registrar</Button>
        </Box>
        <Box className='buttons-auth'  display={islogged ? 'flex' : 'none'}>
            <AvatarCustom name={name || ''} image={image || ''}/>
        </Box>
    </HStack>
  )
}
