"use client"
import { useLogicState } from '@/states/useLogicState';
import { Box, Text, VStack } from '@chakra-ui/react';
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
        <Box bg={'white'} borderRadius={20}>
            <Text fontSize={12} color={'gray'}>{qrcodedata?.[0]?.nome || "Not Found"}</Text>
            <Text fontSize={12} color={'gray'}>{qrcodedata?.[0]?.estado || "Not Found"}</Text>
            <Text fontSize={12} color={'gray'}>{qrcodedata?.[0]?.shortuip_id || "Not Found"}</Text>
        </Box>
    </VStack>
  )
}
