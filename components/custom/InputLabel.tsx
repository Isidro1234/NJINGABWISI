import { Input, Text, VStack } from '@chakra-ui/react'
import React from 'react'

export default function InputLabel({label ,onchange, placeholder, type} : {label:string, placeholder:string,
    onchange:Function, type:string,
}) {
  return (
    <VStack  gap={1} width={'100%'} alignItems={'flex-start'}>
        <Text color={'gray'} fontWeight={400} fontSize={12}>{label}</Text>
        <Input type={type} placeholder={placeholder} onChange={(e)=>{onchange(e.target.value)}}/>
    </VStack>
  )
}
