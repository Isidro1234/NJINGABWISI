'use client'
import { Button, Heading, HStack, Input, Stack, Text, VStack } from '@chakra-ui/react'
import Image from 'next/image'
import React, { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import AvatarCustom from './AvatarCustom'
import { auth } from '@/config/firebse'
import CustomMenu from './CustomMenu'

export default function NavBarLogged() {
    const pathname = usePathname();
    const isBwisiPage = pathname === '/portal';
    const router = useRouter()
    useEffect(()=>{
        const menu = document.getElementsByClassName('navbar-logged-menu-items');
         Array.from(menu[0].children).map((item)=>{
            console.log('pathname:' , pathname,  "este e: " , item.textContent)
            if(pathname.includes(item.textContent)){
                item.classList.add('navbar-logged-menu-item-active');
            }else if(item.textContent.includes('Dashboard') && pathname === '/portal' || pathname =='/portaladministrador' || pathname =='/portalcolaborador'){
                item.classList.add('navbar-logged-menu-item-active');
            }else{
                item.classList.remove('navbar-logged-menu-item-active');
            }
        })
    }, [pathname])
   
  return (
    <VStack className='navbar-logged'>
        <HStack className='navbar-logged-conteiner-top' >
            <VStack className='navbar-logged-logo-conteiner' >
                <Image className='logos' width={40} height={40} src={'/icons/angola-flag.svg'} alt='logo'/>
            </VStack>
            <HStack className='navbar-logged-menu-conteiner' >
                <HStack className='navbar-logged-menu-items'  gap={0}>
                    <Text className='navbar-logged-menu-item' onClick={()=>{router.push('/portal')}}>Dashboard</Text> 
                    <Text className='navbar-logged-menu-item' onClick={()=>{router.push('/portal/propriedades')}}>propriedades</Text> 
                    <Text className='navbar-logged-menu-item'  onClick={()=>{router.push('/portal/pagamentos')}}>pagamentos</Text> 
                    <Text className='navbar-logged-menu-item'  onClick={()=>{router.push('/portal/Impostos')}}>Impostos</Text> 
                    <Text className='navbar-logged-menu-item'  onClick={()=>{router.push('/portal/Registrar')}}>Registrar</Text>
                    <Text className='navbar-logged-menu-item'  onClick={()=>{router.push('/portal/ValidaUIP')}}>Validar UIP</Text>
                    <Text className='navbar-logged-menu-item'  onClick={()=>{router.push('/portal/VenderPropriedade')}}>Vender Propriedade</Text>
                    <Text className='navbar-logged-menu-item'  onClick={()=>{router.push('/portal/FuncionariosGov')}}>Funcionarios Gov</Text> 
                </HStack>
                <Button className='navbar-logged-button' ><Image  width={20} height={20} src={'/icons/search.svg'} alt='icon-search'/></Button>
            </HStack>
            <Stack className='mobile-menu'>
               
            </Stack>
            
            <HStack className='navbar-logged-user-conteiner' >
                <Button className='navbar-logged-button' ><Image  width={20} height={20} src={'/icons/message-icon.svg'} alt='icon-search'/></Button>
                <Button className='navbar-logged-button' ><Image  width={20} height={20} src={'/icons/bell-icon.svg'} alt='icon-search'/></Button>
                <span className='space'></span>
                <CustomMenu menuitems={[{label:'Perfil', value:'/portal/perfil'}, 
                {label:'Sair', value:'/portal/sair'}]} icon={
                   <AvatarCustom name={auth.currentUser?.displayName || ''} 
                   image={auth.currentUser?.photoURL || '/icons/avatar.svg'}/> 
                }  />
                
            </HStack>
        </HStack>
        <HStack className='navbar-logged-conteiner-bottom' >
            <VStack className='navbar-logged-welcome' >
                <Heading className='navbar-logged-welcome-text' >Ola, {auth.currentUser?.displayName?.split(' ')[0] || ''}!</Heading>
                <Text className='navbar-logged-welcome-subtext' >Bem-vindo de volta ao portal Njinga</Text>
            </VStack>
            <HStack className='navbar-logged-other' >
                {isBwisiPage &&
                <HStack className='navbar-logged-other-data-conteiner' >
                    <Text className='navbar-logged-other-text' >Data Fiscal:</Text>
                    <Input className='navbar-logged-data-input' type='date'/>
                </HStack>
                }
            </HStack> 
        </HStack>
    </VStack>
  )
}
