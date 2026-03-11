'use client'
import { Button, Heading, HStack, Input, Stack, Text, VStack } from '@chakra-ui/react'
import Image from 'next/image'
import React, { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import AvatarCustom from './AvatarCustom'
import Message from "../../public/icons/message-1.svg"
import Notification from "../../public/icons/notification-1.svg"
import { auth } from '@/config/firebse'
import CustomMenu from './CustomMenu'

export default function NavBarAdminLogged() {
    const pathname = usePathname();
    const isBwisiPage = pathname === '/admin';
    const router = useRouter()
    useEffect(()=>{
        const menu = document.getElementsByClassName('navbar-logged-menu-items');
         Array.from(menu[0].children).map((item)=>{
            console.log('pathname:' , pathname,  "este e: " , item.textContent)
            if(pathname.includes(item.textContent)){
                item.classList.add('navbar-logged-menu-item-active');
            }else if(item.textContent.includes('Dashboard') && pathname === '/admin/portaladministrador' || pathname =='/portaladministrador' || pathname =='/portalcolaborador'){
                item.classList.add('navbar-logged-menu-item-active');
            }else{
                item.classList.remove('navbar-logged-menu-item-active');
            }
        })
    }, [pathname])
   
  return (
    <VStack className='navbar-logged' bg={'white'}>
        <HStack className='navbar-logged-conteiner-top' >
            <VStack className='navbar-logged-logo-conteiner' >
                <Image className='logos' width={40} height={40} src={'/icons/angola-flag.svg'} alt='logo'/>
            </VStack>
            <HStack className='navbar-logged-menu-conteiner' >
                <HStack className='navbar-logged-menu-items'  gap={0}>
                    <Text className='navbar-logged-menu-item' onClick={()=>{router.push('/admin/portaladministrador')}}>Dashboard</Text> 
                    <Text className='navbar-logged-menu-item' onClick={()=>{router.push('/admin/portaladministrador/propriedades')}}>propriedades</Text> 
                    <Text className='navbar-logged-menu-item'  onClick={()=>{router.push('/admin/portaladministrador/pagamentos')}}>pagamentos</Text> 
                    <Text className='navbar-logged-menu-item'  onClick={()=>{router.push('/admin/portaladministrador/Impostos')}}>Impostos</Text> 
                    <Text className='navbar-logged-menu-item'  onClick={()=>{router.push('/admin/portaladministrador/Registrar')}}>Registrar</Text>
                    <Text className='navbar-logged-menu-item'  onClick={()=>{router.push('/admin/portaladministrador/ValidaUIP')}}>Validar UIP</Text>
                    <Text className='navbar-logged-menu-item'  onClick={()=>{router.push('/admin/portaladministrador/VenderPropriedade')}}>Vender Propriedade</Text>
                    <Text className='navbar-logged-menu-item'  onClick={()=>{router.push('/admin/portaladministrador/FuncionariosGov')}}>Funcionarios Gov</Text> 
                </HStack>
                <Button className='navbar-logged-button' ><Image  width={20} height={20} src={'/icons/search.svg'} alt='icon-search'/></Button>
            </HStack>
            <Stack className='mobile-menu'>
               
            </Stack>
            
            <HStack className='navbar-logged-user-conteiner' >
                <Button className='navbar-logged-button notification' ><Notification fill={'#f7f7f7'} color={'blue'} width={40} height={40} /></Button>
                <Button className='navbar-logged-button' onClick={()=>{router.push('/messages')}}><Message  width={40} height={40} fill={'blue'} /></Button>
                <span className='space'></span>
                <CustomMenu menuitems={[{label:'Perfil', value:'/admin/portaladministrador/perfil'}, 
                {label:'Sair', value:'/admin/portaladministrador/sair'}]} icon={
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
