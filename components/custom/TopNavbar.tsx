"use client"
import { Box, Button, HStack, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import SelectCustom from './SelectCustom'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation';

export default function TopNavbar() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  async function change(code:string){
      const path = pathname.replace(`/${locale}`, `/${code}`)
      router.push(path)
  }
  return (
    <HStack _dark={{backgroundColor:'#0f0f12', color:'#8f8f8f'}} width={'100%'} alignItems={'center'} justifyContent={'space-between'} 
    background={'#f6f6f6'} padding={'4px 30px'}>
        <Box>
          <Text color={'gray'} fontSize={10}>inta inc</Text>
        </Box>
        <Box>
            <SelectCustom onchange={(e:any)=>{change(e)}} items={[{name:'pt', avatar:"/icons/portugal.svg" , id:'pt'}, 
                {name:'en', avatar:"/icons/usa.svg" , id:'en'},
                {name:'fr', avatar:"/images/france-flag.png" , id:'fr'},
                {name:'zh', avatar:"/icons/china.svg" , id:'zh'},
                {name:'vt', avatar:"/icons/vietnam.svg" , id:'vt'},
                {name:'ar', avatar:"/icons/saudi.svg" , id:'ar'},
                {name:'yo', avatar:"/icons/nigeria.svg" , id:'yo'}
            ]}/>
        </Box>
    </HStack>
  )
}
