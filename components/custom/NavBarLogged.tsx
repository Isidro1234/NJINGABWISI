'use client'
import { Button, Heading, HStack, Input, Stack, Text, VStack } from '@chakra-ui/react'
import Image from 'next/image'
import React, { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import AvatarCustom from './AvatarCustom'
import Message from "../../public/icons/message.svg"
import Notification from "../../public/icons/notification-1.svg"
import { auth } from '@/config/firebse'
import CustomMenu from './CustomMenu'
import { useLocale, useTranslations } from 'next-intl'
import Right from '../../public/icons/right.svg'
import Left from '../../public/icons/left.svg'

export default function NavBarLogged() {
    const t = useTranslations('nav')
    const pathname = usePathname();
    const isBwisiPage = pathname === '/portal';
    const elementref = useRef<HTMLDivElement>(null)
    const locale = useLocale()
    const router = useRouter()

    useEffect(() => {
        const menu = document.getElementsByClassName('navbar-logged-menu-items');
        Array.from(menu[0].children).map((item, index: any) => {
            if (pathname.includes(item.textContent)) {
                item.scrollIntoView({ behavior: 'smooth' })
                item.classList.add('navbar-logged-menu-item-active');
            } else if (item.textContent.includes(t('dashboard')) && pathname === `/${locale}/portal` || pathname === "/messages" || pathname == `/${locale}/portaladministrador` || pathname == `/${locale}/portalcolaborador`) {
                item.scrollIntoView({ behavior: 'smooth' })
                item.classList.add('navbar-logged-menu-item-active');
            } else {
                item.classList.remove('navbar-logged-menu-item-active');
            }
        })
    }, [pathname])

    function handle(direction: string) {
        if (direction == 'left') {
            elementref.current?.scrollBy({ left: 100, behavior: 'smooth' })
        } else {
            elementref.current?.scrollBy({ left: -100, behavior: 'smooth' })
        }
    }

    return (
        <VStack className='navbar-logged' bg={'white'}>
            <HStack className='navbar-logged-conteiner-top'>
                <VStack className='navbar-logged-logo-conteiner'>
                    <Image className='logos' width={40} height={40} src={'/icons/angola-flag.svg'} alt='logo' />
                </VStack>
                <HStack className='navbar-logged-menu-conteiner' position={'relative'}>
                    <Button bg={'transparent'} onMouseOver={() => { handle('right') }}><Left width={20} height={20} /></Button>
                    <HStack className='navbar-logged-menu-items' ref={elementref} gap={0}>
                        <Text className='navbar-logged-menu-item' onClick={() => { router.push('/portal') }}>{t('dashboard')}</Text>
                        <Text className='navbar-logged-menu-item' onClick={() => { router.push('/portal/propriedades') }}>{t('propriedades')}</Text>
                        <Text className='navbar-logged-menu-item' onClick={() => { router.push('/portal/pagamentos') }}>{t('pagamentos')}</Text>
                        <Text className='navbar-logged-menu-item' onClick={() => { router.push('/portal/Registrar') }}>{t('registrar')}</Text>
                        <Text className='navbar-logged-menu-item' onClick={() => { router.push('/portal/UIP') }}>{t('uip')}</Text>
                        <Text className='navbar-logged-menu-item' onClick={() => { router.push('/portal/Vender') }}>{t('vender')}</Text>
                        <Text className='navbar-logged-menu-item' onClick={() => { router.push('/portal/Funcionarios') }}>{t('funcionarios')}</Text>
                    </HStack>
                    <Button className='navbar-logged-button'><Image width={20} height={20} src={'/icons/search.svg'} alt='icon-search' /></Button>
                    <Button bg={'transparent'} onMouseOver={() => { handle('left') }}><Right width={20} height={20} /></Button>
                </HStack>
                <Stack className='mobile-menu'></Stack>
                <HStack className='navbar-logged-user-conteiner'>
                    <Button className='navbar-logged-button notification'><Notification fill={'#f7f7f7'} color={'blue'} width={40} height={40} /></Button>
                    <Button className='navbar-logged-button' onClick={() => { router.push('/portal/Mensagens') }}><Message width={40} height={40} fill={'blue'} /></Button>
                    <span className='space'></span>
                    <CustomMenu menuitems={[{ label: t('perfil'), value: '/portal/perfil' }]} icon={
                        <AvatarCustom name={auth.currentUser?.displayName || ''} image={auth.currentUser?.photoURL || '/icons/avatar.svg'} />
                    } />
                </HStack>
            </HStack>
            <HStack className='navbar-logged-conteiner-bottom'>
                <VStack className='navbar-logged-welcome'>
                    <Heading className='navbar-logged-welcome-text'>{t('welcome', { name: auth.currentUser?.displayName?.split(' ')[0] || '' })}</Heading>
                    <Text className='navbar-logged-welcome-subtext'>{t('welcome_back')}</Text>
                </VStack>
                <HStack className='navbar-logged-other'>
                    {isBwisiPage &&
                        <HStack className='navbar-logged-other-data-conteiner'>
                            <Text className='navbar-logged-other-text'>{t('data_fiscal')}</Text>
                            <Input className='navbar-logged-data-input' type='date' />
                        </HStack>
                    }
                </HStack>
            </HStack>
        </VStack>
    )
}
