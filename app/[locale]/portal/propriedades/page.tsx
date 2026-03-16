"use client"
import CustomCard from '@/components/custom/CustomCard'
import CustomPCard from '@/components/custom/CustomPCard'
import UIPprint from '@/components/custom/UIPprint'
import { useAuthContext } from '@/context/authContext'
import { useLogicState } from '@/states/useLogicState'
import { Text, VStack } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

export default function Propriedades() {
    const t = useTranslations('portal.propriedades')
    const [casas, setcasas] = useState([])
    const { userdata }: any = useAuthContext()
    const meu_registo = useLogicState((state: any) => state.getagenteregisto)
    const [agente, setagente] = useState<any>([])
    const refpdf = useRef(null)
    const casas_registradas = useLogicState((state: any) => state?.getImoveisRegistrado)
  
    useEffect(() => {
      async function getting() {
        const data = await meu_registo()
        setagente(data || [])
        const res = await casas_registradas(userdata?.id)
        if (!res) return
        setcasas(res)
      }
      getting()
    }, [])

  return (
    <VStack alignItems={'flex-start'} padding={5} paddingTop={10} width={'100%'}>
      <CustomCard link='portal/propriedades' description={t('description')}
              title={t('card_properties_title')}
              icon={<Image src={'/icons/imovel.svg'} alt='imovel' width={30} height={30} />}
              bg={'#E3EAFA'}>
              <VStack alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={2} gap={4}>
                <Text fontSize={12} color={'gray'}>{t('properties_list')}</Text>
                {casas.map((item: any, index: any) => (
                  <CustomPCard
                    key={index}
                    image={item?.formulario_imovel?.fotos_da_propriedade[0]}
                    estado={item?.estado}
                    location={item?.formulario_imovel?.utente_rua?.slice(0, 21)}
                    name={'Imovel ' + item?.formulario_imovel?.utente_distrito?.slice(0, 10)}
                  />
                ))}
              </VStack>
            </CustomCard>
    </VStack>
  )
}