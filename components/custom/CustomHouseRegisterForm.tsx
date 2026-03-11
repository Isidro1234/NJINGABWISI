import { Box, Text, VStack } from '@chakra-ui/react'
import Image from 'next/image'
import React from 'react'

export default function CustomHouseRegisterForm({children , title , subtitle, typeOfform}:{children:React.ReactElement,title:string,
    subtitle:string,typeOfform:string,
}) {
  return (
    <VStack>
        <VStack width={'100%'}>
            <Image width={40} height={40} src={'/icons/angola.svg'} alt='logo-angola'/>
            <Box minW={10} width={'100%'}  maxWidth={500} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                <Text textAlign={'center'} fontWeight={700} width={'250px'} fontSize={10} color={'black'}>{title}</Text>
                <Text textAlign={'center'} fontWeight={700} width={'250px'} fontSize={10} color={'black'}>{subtitle}</Text>
                <Text textAlign={'center'} fontWeight={700} width={'300px'} fontSize={10} color={'black'}>{typeOfform}</Text>
            </Box>
        </VStack>
        {children}
    </VStack>
    
  )
}
