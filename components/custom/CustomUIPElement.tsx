import { Box, HStack, Input } from '@chakra-ui/react'
import React from 'react'
import SelectCustomValue from './SelectCustomValue'
import Image from 'next/image'
import CustomQrCodeScanner from './CustomQrcodeScanner'

export default function CustomUIPElement({ showselect , onchange, onclick}: { showselect: boolean, onchange?: (value: string) => void, onclick?: () => void }) {
  return (
    <HStack  flexWrap={'wrap'}>
              <HStack gap={0} padding={2} paddingLeft={4} borderRadius={10} borderWidth={1}>
                <Box minW={10} position={'relative'}><Image width={20} height={20} src={'/icons/uip.svg'} alt='qrcode'/></Box>
                <Input marginLeft={-5} outline={'none'} border={'none'} placeholder='Digite o nome, id  do intermediario...' onChange={(e) => onchange?.(e.target.value)}/>
                <CustomQrCodeScanner onresult={(e:any)=>{console.log(e)}}
                icon={<Box minW={10} position={'relative'} paddingLeft={2}><Image width={20} height={20} src={'/icons/qrcode.svg'} alt='qrcode'/></Box>}
                />
                
                <Box display={showselect ? 'block' : 'none'}>
                <SelectCustomValue setChange={(e:any)=>{console.log(e)}} borderRadius={50} width='150px' items={[{label:'Agente', value:'agente'}, {label:'Cidadao', value:'cidadao'}]}/>    
                </Box>
                
              </HStack>
            <Box className='button-mb'>
              <Box className='button-mb'  onClick={onclick} minWidth={50} cursor={'pointer'} borderRadius={10} position={'relative'} padding={4} bg={'#41AA9B'}><Image width={20} height={20} src={'/icons/send.svg'} alt='qrcode'/></Box>
            </Box>
            </HStack>
  )
}
