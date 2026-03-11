
"use client"
import CustomCard from '@/components/custom/CustomCard'
import CustomPCard from '@/components/custom/CustomPCard'
import UIPprint from '@/components/custom/UIPprint'
import { VStack } from '@chakra-ui/react'
import Image from 'next/image'
import React from 'react'

export default function Propriedades() {
  return (
    <VStack alignItems={'flex-start'} padding={5}paddingTop={10}  width={'100%'} >
      <CustomCard bg={'#E3EAFA'} icon={<Image alt='icon' src={'/icons/imovel.svg'} 
      width={30} height={30}/>} description='bwisi proprieties' title='Minhas Propriedades'>
        <VStack   alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={5} gap={4}>
            <CustomPCard estado='' image='' name='' location='' />
        </VStack>
      </CustomCard>
      <UIPprint ref={null}/>
    </VStack>
  )
}
