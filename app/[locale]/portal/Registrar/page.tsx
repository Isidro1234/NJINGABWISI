"use client"
import CustomCard from '@/components/custom/CustomCard'
import CustomHouseRegisterForm from '@/components/custom/CustomHouseRegisterForm'
import TabsCustom from '@/components/custom/CustomTabc'
import Form1 from '@/components/custom/Form1'
import Form2 from '@/components/custom/Form2'
import { toaster, Toaster } from '@/components/ui/toaster'
import { decryptdata } from '@/logic/encryptdata'
import { useLogicState } from '@/states/useLogicState'
import { Button, HStack, Text, VStack } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React, { useRef, useState } from 'react'

export default function Registar() {
  const t = useTranslations('portal.registar')
  const [form1, setform1] = useState<any>({})
  const [form2, setform2] = useState<any>({})
  const buttonref = useRef<HTMLElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const register = useLogicState((state: any) => state?.registerhouse)

  function clicking() {
    if (!buttonref.current) return
    const doc = buttonref.current.getElementsByTagName('button')
    const cur = currentIndex + 1
    if (cur < doc.length) doc[cur].click()
  }

  function clickinganterior() {
    if (!buttonref.current) return
    const doc = buttonref.current.getElementsByTagName('button')
    const cur = currentIndex - 1
    if (cur >= 0) doc[cur].click()
  }

  function validateForm1(): string | null {
    if (!form1?.primeiro_nome)              return t('errors.primeiro_nome')
    if (!form1?.sobrenome)                  return t('errors.sobrenome')
    if (!form1?.utente_pais)                return t('errors.pais')
    if (!form1?.utente_estado)              return t('errors.estado')
    if (!form1?.utente_municipio)           return t('errors.municipio')
    if (!form1?.utente_destrito)            return t('errors.distrito')
    if (!form1?.utente_rua)                 return t('errors.rua')
    if (!form1?.tipo_de_identificacao)      return t('errors.tipo_identificacao')
    if (!form1?.numero_de_identificacao)    return t('errors.numero_identificacao')
    if (!form1?.fotos_de_identificacao?.length) return t('errors.fotos_identificacao')
    return null
  }

  function validateForm2(): string | null {
    if (!form2?.utente_pais)               return t('errors.pais_imovel')
    if (!form2?.utente_estado)             return t('errors.estado_imovel')
    if (!form2?.utente_municipio)          return t('errors.municipio_imovel')
    if (!form2?.utente_distrito)           return t('errors.distrito_imovel')
    if (!form2?.utente_rua)                return t('errors.rua_imovel')
    if (!form2?.categoria_de_imovel)       return t('errors.categoria')
    if (!form2?.tipo_de_imovel)            return t('errors.tipo_imovel')
    if (!form2?.area_total_do_imove)       return t('errors.area')
    if (!form2?.comprimento_da_propriedade) return t('errors.comprimento')
    if (!form2?.largura_da_propriedade)    return t('errors.largura')
    if (!form2?.fotos_da_propriedade?.length) return t('errors.fotos_imovel')

    const hasDocs = form2?.tenho_documentos === 'sim'
    if (hasDocs && !form2?.documentos_da_lista_de_documentos_completos?.length)
      return t('errors.docs_posse')

    const hasFullDocs = form2?.tenho_documento_completo === 'sim'
    if (!hasFullDocs) {
      if (!form2?.data_da_compra_do_imove)                    return t('errors.data_compra')
      if (!form2?.dono_antigo)                                return t('errors.dono_antigo')
      if (!form2?.nome_do_vendedor_ou_agente_imobiliario)     return t('errors.vendedor')
      if (!form2?.tipo_de_identificacao_do_dono_antigo)       return t('errors.tipo_id_antigo')
      if (!form2?.numero_do_bilhete_ou_uip_do_dono_antigo)    return t('errors.bilhete_antigo')
    }

    const isGovOrInstitutional = ['governamental', 'institucional'].includes(form2?.categoria_de_imovel || '')
    if (isGovOrInstitutional && !form2?.numero_de_aprovacao_do_projecto)
      return t('errors.aprovacao')

    if (!form2?.numero_de_quartos && form2?.numero_de_quartos !== 0)      return t('errors.quartos')
    if (!form2?.numero_de_cozinhas && form2?.numero_de_cozinhas !== 0)    return t('errors.cozinhas')
    if (!form2?.numero_de_salas && form2?.numero_de_salas !== 0)          return t('errors.salas')
    if (!form2?.numero_de_casas_de_banho && form2?.numero_de_casas_de_banho !== 0) return t('errors.casas_banho')

    return null
  }

  async function enviarForms() {
    if (currentIndex === 0) {
      const error = validateForm1()
      if (error) {
        toaster.create({ title: t('errors.incomplete_form'), description: error, type: 'error', duration: 5000 })
        return
      }
      clicking(); return
    }

    if (currentIndex === 1) {
      const error = validateForm2()
      if (error) {
        toaster.create({ title: t('errors.incomplete_form'), description: error, type: 'error', duration: 5000 })
        return
      }
      clicking(); return
    }

    if (currentIndex === 2) {
      const error1 = validateForm1()
      const error2 = validateForm2()
      if (error1 || error2) {
        toaster.create({ title: t('errors.incomplete_form'), description: error1 || error2 || '', type: 'error', duration: 5000 })
        return
      }
      const uip: string = localStorage.getItem('uip') || ''
      const decrypt = decryptdata(uip)?.id
      if (!decrypt) {
        toaster.create({ title: t('errors.session_expired'), description: t('errors.session_expired_desc'), type: 'error', duration: 5000 })
        return
      }
      await register(form1, form2, decrypt)
      toaster.create({ title: t('errors.registered'), description: t('errors.registered_desc'), type: 'success', duration: 5000 })
    }
  }

  return (
    <VStack alignItems={'center'} padding={5} paddingTop={10} width={'100%'}>
      <CustomCard bg='#e9daf9'
        icon={<Image alt='icon' src={'/icons/registar.svg'} width={20} height={20} />}
        description={t('card_description')}
        title={t('card_title')}>

        <VStack flexWrap={'wrap'} justifyContent={'center'} alignItems={'flex-start'}
          width={'100%'} paddingTop={0} gap={4}>

          <TabsCustom
            change={(e: any) => setCurrentIndex(Number(e))}
            buttonref={buttonref}

            form1={
              <CustomHouseRegisterForm
                title={t('form_title')}
                subtitle={t('form_subtitle')}
                typeOfform={t('form_type')}>
                <VStack>
                  <Form1 getform={(e: any) => setform1(e)} />
                </VStack>
              </CustomHouseRegisterForm>
            }

            form2={
              <CustomHouseRegisterForm
                title={t('form_title')}
                subtitle={t('form_subtitle')}
                typeOfform={t('form_type')}>
                <VStack>
                  <Form2 getform2={(e: any) => setform2(e)} />
                </VStack>
              </CustomHouseRegisterForm>
            }

            preview={
              <CustomHouseRegisterForm
                title={t('form_title')}
                subtitle={t('form_subtitle')}
                typeOfform={t('form_type')}>

                <HStack gridTemplateColumns={'repeat(auto-fit,minmax(250px,1fr))'}
                  display={'grid'} width={'100%'} alignItems={'flex-start'}>

                  {/* ── Form 1 preview ── */}
                  <VStack alignItems={'flex-start'} borderWidth={1} borderRadius={10} padding={7}>
                    <Text className='formulariopreviewtitle' fontWeight={700}>{t('preview_form1_title')}</Text>
                    <HStack gap={4} justifyContent={'start'} width={'100%'}>
                      <VStack alignItems={'start'}>
                        {[
                          'f1_primeiro_nome','f1_nome_do_meio','f1_sobrenome','f1_pais',
                          'f1_estado','f1_municipio','f1_comuna','f1_distrito',
                          'f1_rua','f1_tipo_identificacao','f1_identificacao'
                        ].map((key) => (
                          <Text key={key} className='formulariopreviewtitle'>{t(key as any)}:</Text>
                        ))}
                      </VStack>
                      <VStack alignItems={'end'}>
                        {[
                          form1?.primeiro_nome, form1?.nome_do_meio, form1?.sobrenome,
                          form1?.utente_pais, form1?.utente_estado, form1?.utente_municipio,
                          form1?.utente_comuna, form1?.utente_destrito, form1?.utente_rua,
                          form1?.tipo_de_identificacao, form1?.numero_de_identificacao
                        ].map((val, i) => (
                          <Text key={i} className='formulariopreviewtitle'>{val ?? '—'}</Text>
                        ))}
                      </VStack>
                    </HStack>
                    <VStack width={'100%'}>
                      <Text className='formulariopreviewtitle'>{t('preview_id_photos')}</Text>
                      {form1?.fotos_de_identificacao?.map((item: any, index: any) => (
                        <Image key={index} src={item} width={200} height={200} alt={`foto-${index}`} />
                      ))}
                    </VStack>
                  </VStack>

                  {/* ── Form 2 preview ── */}
                  <VStack>
                    <HStack padding={7} borderWidth={1} borderRadius={10}
                      gap={4} justifyContent={'start'} width={'100%'}>
                      <VStack alignItems={'start'}>
                        <Text className='formulariopreviewtitle' fontWeight={700}>{t('preview_form2_title')}</Text>
                        {[
                          'f2_pais','f2_estado','f2_municipio','f2_comuna','f2_distrito','f2_rua',
                          'f2_dono','f2_agente','f2_doc_completo','f2_tem_docs','f2_categoria',
                          'f2_uip','f2_data_compra','f2_dono_antigo','f2_novo_dono','f2_vendedor',
                          'f2_tipo_id_dono_antigo','f2_bilhete_dono_antigo','f2_tipo_imovel',
                          'f2_aprovacao','f2_area','f2_comprimento','f2_largura',
                          'f2_quartos','f2_cozinhas','f2_salas','f2_casas_banho','f2_mais_quartos'
                        ].map((key) => (
                          <Text key={key} className='formulariopreviewtitle'>{t(key as any)}:</Text>
                        ))}
                      </VStack>
                      <VStack alignItems={'end'}>
                        {[
                          form2?.utente_pais, form2?.utente_estado, form2?.utente_municipio,
                          form2?.utente_comuna, form2?.utente_distrito, form2?.utente_rua,
                          form2?.sou_dono_do_imovel, form2?.sou_agente_imobiliario,
                          form2?.tenho_documento_completo, form2?.tenho_documentos,
                          form2?.categoria_de_imovel, form2?.verificar_uip,
                          form2?.data_da_compra_do_imove, form2?.dono_antigo, form2?.novo_dono,
                          form2?.nome_do_vendedor_ou_agente_imobiliario,
                          form2?.tipo_de_identificacao_do_dono_antigo,
                          form2?.numero_do_bilhete_ou_uip_do_dono_antigo,
                          form2?.tipo_de_imovel, form2?.numero_de_aprovacao_do_projecto,
                          form2?.area_total_do_imove, form2?.comprimento_da_propriedade,
                          form2?.largura_da_propriedade, form2?.numero_de_quartos,
                          form2?.numero_de_cozinhas, form2?.numero_de_salas,
                          form2?.numero_de_casas_de_banho,
                          form2?.imovel_tem_mais_quartos ? t('yes') : t('no')
                        ].map((val, i) => (
                          <Text key={i} className='formulariopreviewtitle'>{val ?? '—'}</Text>
                        ))}
                      </VStack>
                    </HStack>

                    {form2?.imovel_tem_mais_quartos &&
                      form2?.quartos_adicionais?.filter((q: any) => q.numero !== 0).length > 0 && (
                        <VStack alignItems={'start'} width={'100%'} borderWidth={1} borderRadius={10} padding={4}>
                          <Text className='formulariopreviewtitle' fontWeight={700}>
                            {t('preview_additional_rooms')}
                          </Text>
                          {form2.quartos_adicionais
                            .filter((q: any) => q.numero !== 0)
                            .map((item: any, index: number) => (
                              <HStack key={index} width={'100%'} justifyContent={'space-between'}>
                                <Text className='formulariopreviewtitle'>{item.quarto}</Text>
                                <Text className='formulariopreviewtitle'>{item.numero}</Text>
                              </HStack>
                            ))}
                        </VStack>
                      )}
                  </VStack>
                </HStack>
              </CustomHouseRegisterForm>
            }
          />

          <HStack justifyContent={'flex-end'} width={'100%'} marginTop={4} gap={2}>
            <Button fontSize={12} borderRadius={50} bg={'blue'} onClick={clickinganterior}>
              {t('btn_previous')}
            </Button>
            <Button fontSize={12} borderRadius={50} bg={'blue'} onClick={enviarForms}>
              {currentIndex >= 2 ? t('btn_submit') : t('btn_next')}
            </Button>
          </HStack>
        </VStack>
      </CustomCard>
      <Toaster />
    </VStack>
  )
}