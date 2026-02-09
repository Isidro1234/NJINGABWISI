import { Box, Button, HStack, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import SelectCustom from './SelectCustom'

export default function TopNavbar() {
  return (
    <HStack width={'100%'} alignItems={'center'} justifyContent={'space-between'} 
    background={'#f6f6f6'} padding={'4px 30px'}>
        <Box>
          <Text color={'gray'} fontSize={10}>Bwisi Corporation</Text>
        </Box>
        <Box>
            <SelectCustom items={[{name:'pt', avatar:"/images/portugal-flag.png" , id:'_pt'}, 
                {name:'en', avatar:"/images/usa-flag.png" , id:'_en'},
                {name:'kb', avatar:"/images/angola-flag-png.png" , id:'_kb'},
                {name:'ki', avatar:"/images/angola-flag-png.png" , id:'_ki'},
                {name:'ft', avatar:"/images/angola-flag-png.png" , id:'_ft'},
                {name:'fr', avatar:"/images/france-flag.png" , id:'_fr'}
            ]}/>
        </Box>
    </HStack>
  )
}
