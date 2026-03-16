"use client"
import CustomCard from '@/components/custom/CustomCard'
import { Box, Button, HStack, Text, VStack } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import CustomPCard from '@/components/custom/CustomPCard'
import CustomECard from '@/components/custom/CustomECard'
import Image from 'next/image'
import CustomUipCard from '@/components/custom/CustomUipCard'
import CustomGovCard from '@/components/custom/CustomGovCard'
import CustomReCard from '@/components/custom/CustomReCard'
import CustomMeuUIP from '@/components/custom/CustomMeuUIP'
import { useAuthContext } from '@/context/authContext'
import CheckoutForm from '@/components/custom/CheckoutForm'
import UIPprint from '@/components/custom/UIPprint'
import { printing_pdf } from '@/logic/printpdf'
import { Toaster, toaster } from '@/components/ui/toaster'
import { useLogicState } from '@/states/useLogicState'
import { auth } from '@/config/firebse'
import CustomCardAgentI from '@/components/custom/CustomCardAgentI'
import TransferirUIP from '@/components/custom/TransferirUIP'
import { useTranslations } from 'next-intl'

export default function Portal() {
  const t = useTranslations('portal.index')

  const casas_registradas = useLogicState((state: any) => state?.getImoveisRegistrado)
  const { userdata }: any = useAuthContext()
  const [casas, setcasas] = useState([])
  const meu_registo = useLogicState((state: any) => state.getagenteregisto)
  const [agente, setagente] = useState<any>([])
  const [servicos, setServicos] = useState<any>([])
  const refpdf = useRef(null)

  useEffect(() => {
    async function getting() {
      const data = await meu_registo()
      const servicos = await buscarServicos() 
      setServicos(servicos)
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
        title: t('errors.no_photo'),
        description: t('errors.no_photo_desc'),
        type: 'warning',
        duration: 5000
      })
      return
    }
    printing_pdf(refpdf, userdata?.nome)
  }
  async function buscarServicos(){
    try {
        const buscar = await fetch('/api/services');
        const res = await buscar.json();
        const {services} = res;
        return services
    } catch (error) {
        console.log(error)
        return []
    }
     

  }
  console.log(servicos)
  return (
    <HStack className='portal-conteiner' display={'grid'}
      gridTemplateColumns={'repeat(auto-fit, minmax(350px,1fr))'}
      alignItems={'flex-start'} width={'100%'} bg={'#f6f6f6'} padding={10}>

      {/* ── My Properties ── */}
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

      {/* ── Agents ── */}
      <CustomCard bg={'#f6f6f6'} link='portal/Agentes' title={t('card_agents_title')}
        description={t('description')}
        icon={<Image src={'/icons/agent-logo.svg'} alt='agente' width={30} height={30} />}>
        {agente.length <= 0 ? (
          <VStack width={'100%'}>
            <Text lineHeight={1.0} width={'100%'} textAlign={'center'} fontSize={12} color={'gray'}>
              {t('apply_agent')}
            </Text>
            <Text lineHeight={1.0} textAlign={'center'} fontSize={12} color={'gray'}>
              {t('apply_agent_sub')}
            </Text>
            <Button bg={'blue'} fontSize={10} borderRadius={50}>
              {t('apply_agent_btn')}
            </Button>
          </VStack>
        ) : (
          <VStack alignItems={'start'} width={'100%'}>
            <Text fontSize={12} color={'gray'}>{t('my_agent_profile')}</Text>
            <CustomCardAgentI
              estado={agente[0]?.estado}
              location={'de ' + agente[0]?.formulario?.provincia}
              name={auth.currentUser?.displayName?.slice(0, 15) || ''}
              image={auth.currentUser?.photoURL || ''}
            />
          </VStack>
        )}
      </CustomCard>

      {/* ── Payments ── */}
      <CustomCard link='portal/pagamentos' description={t('description')}
        title={t('card_payments_title')}
        icon={<Image src={'/icons/coin.svg'} alt='coin' width={50} height={50} />}
        bg={'#f6f6f6'}>
        <VStack alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={2} gap={4}>
          <Text fontSize={12} color={'gray'}>{t('recent_payments')}</Text>
          
        </VStack>
      </CustomCard>

      {/* ── Validate PIU ── */}
      <CustomCard link='portal/ValidaUIP' description={t('description')}
        title={t('card_validate_title')}
        icon={<Image src={'/icons/uip.svg'} alt='uip' width={25} height={25} />}
        bg={'#E3FAF5'}>
        <VStack alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={2} gap={4}>
          <Text fontSize={12} color={'gray'}>{t('validate_piu')}</Text>
          <CustomUipCard />
        </VStack>
      </CustomCard>

      {/* ── Register Property ── */}
      <CustomCard link='portal/Registrar' description={t('description')}
        title={t('card_register_title')}
        icon={<Image src={'/icons/registar.svg'} alt='registar' width={25} height={25} />}
        bg={'#e9daf9'}>
        <VStack alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={5} gap={4}>
          <CustomReCard link='portal/Registrar' />
        </VStack>
      </CustomCard>

      <CheckoutForm />

      {/* ── Gov Employees ── */}
      <CustomCard link='portal/FuncionariosGov' description={t('description')}
        title={t('card_gov_title')}
        icon={<Image src={'/icons/gov.svg'} alt='gov' width={25} height={25} />}
        bg={'#DFFCE7'}>
        <VStack alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={2} gap={4}>
          <Text fontSize={12} color={'gray'}>{t('gov_employees')}</Text>
          <CustomGovCard />
        </VStack>
      </CustomCard>

      {/* ── My UIP ── */}
      <CustomCard link='portal/MeuUIP' description={t('description')}
        title={t('card_uip_title')}
        icon={<Image src={'/icons/stats.svg'} alt='uip' width={25} height={25} />}
        bg={'#ebdffc'}>
        <VStack alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={5} gap={4}>
          <CustomMeuUIP userdata={userdata} />
          <Box position={'fixed'} top={'-9999px'} left={'-9999px'} zIndex={-1}>
            <UIPprint ref={refpdf} />
          </Box>
          <Button bg={'#419f5b'} fontWeight={400} fontSize={10} size={'2xs'}
            onClick={downloadUIP} borderRadius={5}>
            {t('download_pdf')}
          </Button>
        </VStack>
      </CustomCard>

      {/* ── Transfer UIP ── */}
      <CustomCard link='portal/MeuUIP' description={t('description')}
        title={t('card_transfer_title')}
        icon={<Image src={'/icons/vender.svg'} alt='transferir' width={25} height={25} />}
        bg={'#dffcf8'}>
        <TransferirUIP
          casas={casas?.filter((it: any) => it.estado === 'aprovado') || []}
        />
      </CustomCard>

      <Toaster />
    </HStack>
  )
}