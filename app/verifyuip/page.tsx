import { Box, Button, Heading, HStack, Input, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import UIP from '../../public/icons/uip.svg'
import Image from 'next/image'
import SelectCustom from '@/components/custom/SelectCustom'
import SelectCustomValue from '@/components/custom/SelectCustomValue'

export default function VerifyUIP() {
  return (
    <VStack alignItems={'center'} justifyContent={'center'} padding={10} height={'78.5vh'} width={'100%'} bg={'#f6f6f6'}>
       <Box bg={'white'} padding={10} borderRadius={20}>
          <HStack gap={3}>
            <Box position={'relative'} width={70} height={70} alignItems={'center'} 
            justifyContent={'center'} display={'flex'} borderRadius={50} bg={'#E3FAF5'}>
              <Image alt='uip' src={'/icons/uip.svg'} width={30} height={30}/>
            </Box>
          <VStack flex={1} gap={0} alignItems={'flex-start'}>
            <Heading lineHeight={1.2}>Verificar UIP</Heading>
            <Text paddingLeft={1} fontSize={10} color={'gray'}>bwisi corporation</Text>
          </VStack>
          <Box marginRight={2} position={'relative'} width={50} height={50} alignItems={'center'} justifyContent={'center'} display={'flex'} borderRadius={50} bg={'#f6f6f6'}>
              <Image alt='uip' src={'/icons/angola-flag.svg'} width={45} height={45}/>
            </Box>
          </HStack>
          <VStack alignItems={'flex-start'} padding={2} paddingTop={4}>
            <Text fontSize={12} color={'gray'}>Verifique uip/piu</Text>
            <HStack width={'100%'} flexWrap={'wrap'}>
              <HStack gap={0} padding={2} paddingLeft={4} borderRadius={10} borderWidth={1}>
                <Box minW={10} position={'relative'}><Image width={20} height={20} src={'/icons/uip.svg'} alt='qrcode'/></Box>
                <Input outline={'none'} border={'none'} placeholder='Digite o nome, id  do intermediario...'/>
                <Box minW={10} position={'relative'} paddingLeft={2}><Image width={20} height={20} src={'/icons/qrcode.svg'} alt='qrcode'/></Box>
                <SelectCustomValue width='150px' items={[{label:'Agente', value:'agente'}, {label:'Cidadao', value:'cidadao'}]}/>
              </HStack>
            <Box className='button-mb'>
              <Box className='button-mb' minWidth={50} cursor={'pointer'} borderRadius={10} position={'relative'} padding={4} bg={'#41AA9B'}><Image width={20} height={20} src={'/icons/send.svg'} alt='qrcode'/></Box>
            </Box>
            </HStack>
            
          </VStack>
          
       </Box>
    </VStack>
  )
}
