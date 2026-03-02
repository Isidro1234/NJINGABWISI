import { Box, HStack, Input } from '@chakra-ui/react'
import React, { useState } from 'react'
import SelectCustomValue from './SelectCustomValue'
import Image from 'next/image'
import CustomQrCodeScanner from './CustomQrcodeScanner'

export default function CustomUIPElement({ showselect , onchange, onclick, value , onchangeselect}: { onchangeselect?: (value: string) => void, showselect: boolean, onchange?: (value: string) => void, onclick?: () => void, value?: string }) {
    const [inputValue, setInputValue] = useState('')
    function handleInputChange(e:any) {
        console.log("this is scannerUIP", e)
        setInputValue(e)
        onchange?.(e)
    }
    return (
    <HStack  width={'100%'} display={'grid'} gridTemplateColumns={'repeat(auto-fit,  minmax(200px, 1fr))'}>
              <HStack gap={0} padding={2} paddingLeft={4} borderRadius={10} borderWidth={1}>
                <Box minW={10} position={'relative'}><Image width={20} height={20} src={'/icons/uip.svg'} alt='qrcode'/></Box>
                <Input fontSize={12} value={inputValue} marginLeft={-5} outline={'none'} border={'none'} 
                placeholder='Digite o nome, id  do intermediario...' 
                onChange={(e)=>{handleInputChange(e.target.value)}}/>
                <CustomQrCodeScanner onresult={(e:any)=>{handleInputChange(e)}}
                icon={<Box minW={10} position={'relative'} paddingLeft={2}><Image width={20} height={20} src={'/icons/qrcode.svg'} alt='qrcode'/></Box>}
                />
                
                <Box display={showselect ? 'block' : 'none'}>
                <SelectCustomValue setChange={(e:any)=>{onchangeselect?.(e)}} borderRadius={50} width='80px' items={[{label:'Agente', value:'agente'}, {label:'Cidadao', value:'cidadao'}]}/>    
                </Box>
                
              </HStack>
            <Box className='button-mb'>
              <Box className='button-mb' display={'flex'} alignItems={'center'} justifyContent={'center'} onClick={onclick} minWidth={50} cursor={'pointer'} borderRadius={10} position={'relative'} padding={4} bg={'#41AA9B'}><Image width={20} height={20} src={'/icons/send.svg'} alt='qrcode'/></Box>
            </Box>
            </HStack>
  )
}
