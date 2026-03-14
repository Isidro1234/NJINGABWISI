"use client"
import CustomCard from '@/components/custom/CustomCard'
import CustomECard from '@/components/custom/CustomECard'
import CustomGovCard from '@/components/custom/CustomGovCard'
import CustomMeuUIP from '@/components/custom/CustomMeuUIP'
import CustomReCard from '@/components/custom/CustomReCard'
import CustomUipCard from '@/components/custom/CustomUipCard'
import UIPprint from '@/components/custom/UIPprint'
import { Box, Button, Text, VStack } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React from 'react'

export default function DashboardCollaborator() {
  const t = useTranslations('admin.dashboard')

  return (
    <VStack className='portal-conteiner' display={'grid'}
      gridTemplateColumns={'repeat(auto-fit, minmax(350px,1fr))'}
      alignItems={'flex-start'} width={'100%'} bg={'#f6f6f6'} padding={10}>

      {/* ── Validate Properties ── */}
      <CustomCard link='portal/propriedades' description={t('description')}
        title={t('card_validate_properties')}
        icon={<Image src={'/icons/imovel.svg'} alt='imovel' width={30} height={30} />}
        bg={'#E3EAFA'}>
        <VStack>
          Hello world
        </VStack>
      </CustomCard>

      {/* ── Agents ── */}
      <CustomCard bg={'#f6f6f6'} link='portal/Agentes'
        title={t('card_agents')} description={t('description')}
        icon={<Image src={'/icons/agent-logo.svg'} alt='agente' width={30} height={30} />}>
        <Box />
      </CustomCard>

      {/* ── Payments ── */}
      <CustomCard link='portal/pagamentos' description={t('description')}
        title={t('card_payments')}
        icon={<Image src={'/icons/coin.svg'} alt='coin' width={50} height={50} />}
        bg={'#f6f6f6'}>
        <VStack alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={2} gap={4}>
          <Text fontSize={12} color={'gray'}>{t('recent_payments')}</Text>
          <CustomECard />
        </VStack>
      </CustomCard>

      {/* ── Validate PIU ── */}
      <CustomCard link='portal/ValidaUIP' description={t('description')}
        title={t('card_validate_piu')}
        icon={<Image src={'/icons/uip.svg'} alt='uip' width={25} height={25} />}
        bg={'#E3FAF5'}>
        <VStack alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={2} gap={4}>
          <Text fontSize={12} color={'gray'}>{t('validate_piu')}</Text>
          <CustomUipCard />
        </VStack>
      </CustomCard>

      {/* ── Register Property ── */}
      <CustomCard link='portal/Registrar' description={t('description')}
        title={t('card_register')}
        icon={<Image src={'/icons/registar.svg'} alt='registar' width={25} height={25} />}
        bg={'#e9daf9'}>
        <VStack alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={5} gap={4}>
          <CustomReCard link='' />
        </VStack>
      </CustomCard>

      {/* ── Gov Employees ── */}
      <CustomCard link='portal/FuncionariosGov' description={t('description')}
        title={t('card_gov')}
        icon={<Image src={'/icons/gov.svg'} alt='gov' width={25} height={25} />}
        bg={'#DFFCE7'}>
        <VStack alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={2} gap={4}>
          <Text fontSize={12} color={'gray'}>{t('gov_employees')}</Text>
          <CustomGovCard />
        </VStack>
      </CustomCard>

      {/* ── My UIP ── */}
      <CustomCard link='portal/MeuUIP' description={t('description')}
        title={t('card_uip')}
        icon={<Image src={'/icons/stats.svg'} alt='uip' width={25} height={25} />}
        bg={'#ebdffc'}>
        <VStack alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={5} gap={4}>
          <CustomMeuUIP userdata={null} />
          <Box position={'fixed'} top={'-9999px'} left={'-9999px'} zIndex={-1}>
            <UIPprint ref={null} />
          </Box>
          <Button bg={'#419f5b'} fontWeight={400} fontSize={10} size={'2xs'} borderRadius={5}>
            {t('download_pdf')}
          </Button>
        </VStack>
      </CustomCard>

    </VStack>
  )
}