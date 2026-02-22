import { CustomCaroussel } from '@/components/custom/CustomCaroussel'
import Footer from '@/components/structures/Footer'
import { Box, Button, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import React from 'react'

export default function Servicos() {
  const servicos = [{title:'Impostos', text:'Com a NJINGA podes pagar seus impostos de maneira online'},
    {title:'Registo', text:'A NJINGA te ajuda a registar seus imoveis de maneira simples e pratica'},
    {title:'PIU/UIP', text:'A NJINGA possui uma technologia propria de identificacao digital de usuarios online'}
  ]
  return (
    <VStack bg={'#da3d3d'} padding={0} gap={0} height={'100%'} width={'100%'}>
      <VStack width={'100%'}>
          <CustomCaroussel width={'100px'} items={[{image:"/images/bicycle.jpg"},{image:'/images/service1.jpg'}]}/>
      </VStack>
      <HStack bg={'#da3d3d'} height={'100%'} alignItems={'flex-start'} padding={5} gap={5} flexWrap={'wrap'} width={'100%'}>
        <VStack bg={'#da3d3d'} height={'100%'} padding={5} paddingBottom={10} width={'100%'}  gap={5}>
          <Heading color={'white'}>Servicos</Heading>
          <VStack height={'100%'} gap={4} maxWidth={1000} width={'100%'} display={'grid'} gridTemplateColumns={`repeat(auto-fit, minmax(300px, 1fr))`}>
              {servicos.map((item:any, index)=>{
                return(
                  <Box gap={2}  bg={'white'} alignItems={'center'} display={'flex'} flexDirection={'column'} key={index} padding={5} borderRadius={10} borderWidth={1}>
                      <Heading textAlign={'center'} color={'red'} fontSize={17}>{item?.title}</Heading>
                      <Text textAlign={'center'} color={'gray'} fontSize={12}>{item?.text}</Text>
                      <Button marginTop={2} bg={'#da3d3d'} borderRadius={50}>Comecar agora</Button>
                  </Box>
                )
              })}
          </VStack>
          
        </VStack>
      </HStack>
      <Footer/>
    </VStack>
  )
}
