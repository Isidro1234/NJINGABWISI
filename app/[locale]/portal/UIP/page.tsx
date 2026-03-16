import CustomCard from '@/components/custom/CustomCard'
import CustomMeuUIP from '@/components/custom/CustomMeuUIP'
import UIPprint from '@/components/custom/UIPprint'
import { toaster } from '@/components/ui/toaster'
import { useAuthContext } from '@/context/authContext'
import { printing_pdf } from '@/logic/printpdf'
import { useLogicState } from '@/states/useLogicState'
import { Box, Button, VStack } from '@chakra-ui/react'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

export default function ValidarUIP() {

  
    const casas_registradas = useLogicState((state: any) => state?.getImoveisRegistrado)
    const { userdata }: any = useAuthContext()
    const [casas, setcasas] = useState([])
    const meu_registo = useLogicState((state: any) => state.getagenteregisto)
    const [agente, setagente] = useState<any>([])
    const refpdf = useRef(null)
  
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
  
    function downloadUIP() {
      if (!userdata?.photo) {
        toaster.create({
          title: 'errors.no_photo',
          description: 'errors.no_photo_desc',
          type: 'warning',
          duration: 5000
        })
        return
      }
      printing_pdf(refpdf, userdata?.nome)
    }
  return (
    <div>
      <CustomCard link='portal/MeuUIP' description={'description'}
              title={'card_uip_title'}
              icon={<Image src={'/icons/stats.svg'} alt='uip' width={25} height={25} />}
              bg={'#ebdffc'}>
              <VStack alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={5} gap={4}>
                <CustomMeuUIP userdata={userdata} />
                <Box position={'fixed'} top={'-9999px'} left={'-9999px'} zIndex={-1}>
                  <UIPprint ref={refpdf} />
                </Box>
                <Button bg={'#419f5b'} fontWeight={400} fontSize={10} size={'2xs'}
                  onClick={downloadUIP} borderRadius={5}>
                  'download_pdf'
                </Button>
              </VStack>
            </CustomCard>
    </div>
  )
}
