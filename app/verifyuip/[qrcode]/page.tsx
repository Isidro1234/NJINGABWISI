"use client"
import CustomCard from '@/components/custom/CustomCard';
import CustomMeuUIP from '@/components/custom/CustomMeuUIP';
import { useLogicState } from '@/states/useLogicState';
import { Box, Text, VStack } from '@chakra-ui/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

export default  function Qrcode({params}:{params:Promise<{qrcode:string}>}) {
    const getqrcodedata = useLogicState((state:any)=>state.getUIPprofile)
    const [qrcodedata, setQrcodedata] = useState<Array<any>| null>(null);
    useEffect(()=>{
        async function fetchData(){
            const {qrcode} = await params;
            const data = await getqrcodedata(qrcode)   
            setQrcodedata([data])
        }
        fetchData()
    }, [qrcodedata])
  return (
    <VStack width={'100%'} height={'100%'} bg={'#f6f6f6'} padding={10}>
        <CustomCard link='portal/MeuUIP' description='bwisi proprieties' title='Meu PIU/UIP' 
              icon={<Image src={'/icons/stats.svg'} alt='uip' width={25} height={25}/>}
               bg={'#ebdffc'}>
                <VStack   alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={5} gap={4}>
                    <Text fontSize={12} color={'gray'}>{qrcodedata?.[0]?.nome || "Not Found"}</Text>
                    <Text fontSize={12} color={'gray'}>{qrcodedata?.[0]?.estado || "Not Found"}</Text>
                    <Text fontSize={12} color={'gray'}>{qrcodedata?.[0]?.shortuip_id || "Not Found"}</Text>
                </VStack>
              </CustomCard>
    </VStack>
  )
}
