
"use client"
import { useNotificationContext } from '@/context/notificationContext'
import { useStateAuth } from '@/states/useAuthState'
import { Button, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

export default function Perfiladmin() {

    const t = useTranslations('perfilAdmin')

    const logout = useStateAuth((state:any)=>state.logout)
    const {requestPermission , permission} = useNotificationContext();
    const [user, setUSer] = useState<any>([])

    useEffect(()=>{

    },[])

    async function logouts(){
        await logout()
    }

  return (
    <VStack>
        <Button onClick={()=>{requestPermission('fd')}}>
            {t('buttons.enableNotifications')}
        </Button> 

        <Button onClick={logouts}>
            {t('buttons.logout')}
        </Button> 
    </VStack>
  )
}

