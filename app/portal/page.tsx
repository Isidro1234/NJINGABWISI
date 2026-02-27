"use client"
import CustomCard from '@/components/custom/CustomCard'
import { Box, Button, HStack, Input, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import Property from '../../public/icons/imovel.svg'
import Coin from  '../../public/icons/coin.svg'
import CustomPCard from '@/components/custom/CustomPCard'
import CustomECard from '@/components/custom/CustomECard'
import UIP from '../../public/icons/uip.svg'
import Image from 'next/image'
import CustomUipCard from '@/components/custom/CustomUipCard'
import CustomGovCard from '@/components/custom/CustomGovCard'
import CustomReCard from '@/components/custom/CustomReCard'
import CustomMeuUIP from '@/components/custom/CustomMeuUIP'

export default function Portal() {
  return (
    <HStack className='portal-conteiner' display={'grid'} gridTemplateColumns={'repeat(auto-fit, minmax(350px,1fr))'} 
    alignItems={'flex-start'} width={'100%'}  bg={'#f6f6f6'} padding={10}>
      <CustomCard link='portal/propriedades' description='bwisi proprieties' title='Meus Imóveis' 
      icon={<Image src={'/icons/imovel.svg'} alt='imovel' width={30} height={30}/>}
       bg={'#E3EAFA'}>
        <VStack   alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={5} gap={4}>
            <Text fontSize={14} color={'gray'}>Lista de propriedades</Text>
            <CustomPCard/>
        </VStack>
      </CustomCard>
      <CustomCard link='portal/pagamentos' description='bwisi proprieties' title='Emolumentos' 
      icon={<Image src={'/icons/coin.svg'} alt='coin' width={50} height={50}/>}
       bg={'#f6f6f6'}>
        <VStack   alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={5} gap={4}>
            <Text fontSize={14} color={'gray'}>Pagamentos Recentes</Text>
            <CustomECard/>
        </VStack>
      </CustomCard>
      <CustomCard link='portal/ValidaUIP' description='bwisi proprieties' title='Validar PIU' 
      icon={<Image src={'/icons/uip.svg'} alt='uip' width={25} height={25}/>}
       bg={'#E3FAF5'}>
        <VStack   alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={5} gap={4}>
            <Text fontSize={14} color={'gray'}>Validar PIU</Text>
            <CustomUipCard/>
        </VStack>
      </CustomCard>
      <CustomCard link='portal/Registrar' description='bwisi proprieties' title='Registar Imóvel' 
      icon={<Image src={'/icons/registar.svg'} alt='uip' width={25} height={25}/>}
       bg={'#e9daf9'}>
        <VStack   alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={5} gap={4}>
            <CustomReCard/>
        </VStack>
      </CustomCard>
      <CustomCard link='portal/FuncionariosGov' description='bwisi proprieties' title='Funcionarios Gov' 
      icon={<Image src={'/icons/gov.svg'} alt='uip' width={25} height={25}/>}
       bg={'#DFFCE7'}>
        <VStack   alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={5} gap={4}>
            <Text fontSize={14} color={'gray'}>Actuais Funcioarios Gov</Text>
            <CustomGovCard/>
        </VStack>
      </CustomCard>
      <CustomCard link='portal/MeuUIP' description='bwisi proprieties' title='Meu PIU/UIP' 
      icon={<Image src={'/icons/stats.svg'} alt='uip' width={25} height={25}/>}
       bg={'#ebdffc'}>
        <VStack   alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={5} gap={4}>
            <CustomMeuUIP/>
        </VStack>
      </CustomCard>
    </HStack>
  )
}
