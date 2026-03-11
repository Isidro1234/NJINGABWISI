"use client"
import CustomCard from '@/components/custom/CustomCard'
import CustomECard from '@/components/custom/CustomECard'
import CustomGovCard from '@/components/custom/CustomGovCard'
import CustomMeuUIP from '@/components/custom/CustomMeuUIP'
import CustomReCard from '@/components/custom/CustomReCard'
import CustomUipCard from '@/components/custom/CustomUipCard'
import UIPprint from '@/components/custom/UIPprint'
import { Box, Button, Text, VStack } from '@chakra-ui/react'
import Image from 'next/image'
import React from 'react'

export default function DashboardCollaborator() {
  return (
    <VStack  className='portal-conteiner' display={'grid'} gridTemplateColumns={'repeat(auto-fit, minmax(350px,1fr))'} 
    alignItems={'flex-start'} width={'100%'}  bg={'#f6f6f6'} padding={10}>
        <CustomCard link='portal/propriedades' description='inta inc' title='Validar Imóveis' 
              icon={<Image src={'/icons/imovel.svg'} alt='imovel' width={30} height={30}/>}
               bg={'#E3EAFA'}>
                <VStack>
                    Hello world
                </VStack>
        </CustomCard>
        <CustomCard bg={'#f6f6f6'} link='portal/Agentes' title='Agentes' 
              description='inta inc'
              icon={<Image src={'/icons/agent-logo.svg'} alt='imovel' width={30} height={30}/>}>
                 
            <Box></Box>
                    
        </CustomCard>
        <CustomCard link='portal/pagamentos' description='inta inc' title='Emolumentos' 
              icon={<Image src={'/icons/coin.svg'} alt='coin' width={50} height={50}/>}
               bg={'#f6f6f6'}>
                <VStack   alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={2} gap={4}>
                    <Text fontSize={12} color={'gray'}>Pagamentos Recentes</Text>
                    <CustomECard/>
                </VStack>
         </CustomCard>
              <CustomCard link='portal/ValidaUIP' description='inta inc' title='Validar PIU' 
              icon={<Image src={'/icons/uip.svg'} alt='uip' width={25} height={25}/>}
               bg={'#E3FAF5'}>
                <VStack   alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={2} gap={4}>
                    <Text fontSize={12} color={'gray'}>Validar PIU</Text>
                    <CustomUipCard/>
                </VStack>
              </CustomCard>
              <CustomCard link='portal/Registrar' description='inta inc' title='Registar Imóvel' 
              icon={<Image src={'/icons/registar.svg'} alt='uip' width={25} height={25}/>}
               bg={'#e9daf9'}>
                <VStack   alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={5} gap={4}>
                    <CustomReCard/>
                </VStack>
              </CustomCard>
             
              
              <CustomCard link='portal/FuncionariosGov' description='inta inc' title='Funcionarios Gov' 
              icon={<Image src={'/icons/gov.svg'} alt='uip' width={25} height={25}/>}
               bg={'#DFFCE7'}>
                <VStack   alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={2} gap={4}>
                    <Text fontSize={12} color={'gray'}>Actuais Funcioarios Gov</Text>
                    <CustomGovCard/>
                </VStack>
              </CustomCard>
              <CustomCard link='portal/MeuUIP' description='inta inc' title='Meu PIU/UIP' 
              icon={<Image src={'/icons/stats.svg'} alt='uip' width={25} height={25}/>}
               bg={'#ebdffc'}>
                <VStack   alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={5} gap={4}>
                    <CustomMeuUIP userdata={null}/>
                    <Box position={'fixed'}
          top={'-9999px'}
          left={'-9999px'}
          zIndex={-1}>
                      <UIPprint ref={null}/>
                    </Box>
                    <Button bg={'#419f5b'} fontWeight={400} fontSize={10} size={'2xs'} 
                      borderRadius={5}>baixar em pdf</Button>
                </VStack>
              </CustomCard>
    </VStack>
  )
}
