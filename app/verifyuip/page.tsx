"use client"
import { Box, Button, Heading, HStack, Input, Text, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import UIP from '../../public/icons/uip.svg'
import Image from 'next/image'
import SelectCustom from '@/components/custom/SelectCustom'
import SelectCustomValue from '@/components/custom/SelectCustomValue'
import CustomUIPElement from '@/components/custom/CustomUIPElement'
import { useLogicState } from '@/states/useLogicState'

export default function VerifyUIP() {
  const [selectedOption, setSelectedOption] = useState('uip');
  const [inputValue, setInputValue] = useState('');
  const getqrcodedata = useLogicState((state:any)=>state.getUIPprofile)
  const [qrcodedata, setQrcodedata] = useState<Array<any>| null>(null);
      useEffect(()=>{
          async function fetchData(){
              const data = await getqrcodedata(inputValue)   
              setQrcodedata([data])
          }
          fetchData()
      }, [inputValue])
  return (
    <VStack alignItems={'center'} justifyContent={'center'} padding={10} height={'100%'} width={'100%'} bg={'#d33434'}>
       <Box bg={'white'} padding={5} borderRadius={20}>
          <HStack width={'100%'} gap={3}>
            <Box position={'relative'} width={70} height={70} alignItems={'center'} 
            justifyContent={'center'} display={'flex'} borderRadius={50} bg={'#E3FAF5'}>
              <Image alt='uip' src={'/icons/uip.svg'} width={30} height={30}/>
            </Box>
          <VStack flex={1} gap={0} alignItems={'flex-start'}>
            <Heading lineHeight={1.2}>Verificar UIP</Heading>
            <Text paddingLeft={1} fontSize={10} color={'gray'}>by bwisi corporation</Text>
          </VStack>
          <Box marginRight={2} position={'relative'} width={50} height={50} alignItems={'center'} justifyContent={'center'} display={'flex'} borderRadius={50} bg={'#f6f6f6'}>
              <Image alt='uip' src={'/icons/angola-flag.svg'} width={45} height={45}/>
            </Box>
          </HStack>
          <VStack alignItems={'flex-start'} padding={2} paddingTop={4}>
            <Text fontSize={12} color={'gray'}>Verifique uip/piu</Text>
            <CustomUIPElement value={selectedOption} onchange={(e:any)=>{setInputValue(e)}} onchangeselect={(value) => setSelectedOption(value)} showselect={true}/>

          </VStack>
       </Box>
    </VStack>
  )
}
