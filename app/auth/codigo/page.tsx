import { Box, Input, VStack } from '@chakra-ui/react'
import React from 'react'

export default function Code() {
  return (
    <VStack bg={'#d33434'} width={'100%'} height={'100%'} padding={10}>
       <Box bg={'white'} padding={10} borderRadius={20}>
          <Input placeholder='code'/>
       </Box>
    </VStack>
  )
}
