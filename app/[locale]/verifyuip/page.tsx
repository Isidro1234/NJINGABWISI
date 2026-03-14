"use client"
import { Box, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import CustomUIPElement from '@/components/custom/CustomUIPElement'
import { useLogicState } from '@/states/useLogicState'
import { useTranslations } from 'next-intl'
import CustomUipUICard from '@/components/custom/CustomUipUICard'

export default function VerifyUIP() {
  const t = useTranslations('verifyuip')
  const [selectedOption, setSelectedOption] = useState('uip')
  const [inputValue, setInputValue] = useState('')
  const getqrcodedata = useLogicState((state: any) => state.getUIPprofile)
  const [qrcodedata, setQrcodedata] = useState<Array<any> | null>(null)

  useEffect(() => {
    fetchData()
  }, [])
   async function fetchData() {
      const data = await getqrcodedata(inputValue)
      setQrcodedata([data])
    }
  return (
    <VStack alignItems={'center'} justifyContent={'center'} padding={10}
      height={'100%'} width={'100%'} bg={'#d33434'}>
      <Box bg={'white'} padding={5} borderRadius={20}>

        <HStack width={'100%'} gap={3}>
          <Box position={'relative'} width={70} height={70} alignItems={'center'}
            justifyContent={'center'} display={'flex'} borderRadius={50} bg={'#E3FAF5'}>
            <Image alt='uip' src={'/icons/uip.svg'} width={30} height={30} />
          </Box>
          <VStack flex={1} gap={0} alignItems={'flex-start'}>
            <Heading lineHeight={1.2}>{t('title')}</Heading>
            <Text paddingLeft={1} fontSize={10} color={'gray'}>{t('by')}</Text>
          </VStack>
          <Box marginRight={2} position={'relative'} width={50} height={50}
            alignItems={'center'} justifyContent={'center'} display={'flex'}
            borderRadius={50} bg={'#f6f6f6'}>
            <Image alt='angola flag' src={'/icons/angola-flag.svg'} width={45} height={45} />
          </Box>
        </HStack>

        <VStack alignItems={'flex-start'} padding={2} paddingTop={4}>
          <Text fontSize={12} color={'gray'}>{t('subtitle')}</Text>
          <CustomUIPElement
            value={selectedOption}
            onchange={(e: any) => setInputValue(e)}
            onchangeselect={(value) => setSelectedOption(value)}
            showselect={true}
            onclick={fetchData}
          />
        </VStack>
        <VStack>
          {qrcodedata?.map((item:any, index:any)=>{
            return(
              <CustomUipUICard key={index} userdata={item}/>
            )
          })}
        </VStack>
      </Box>
    </VStack>
  )
}