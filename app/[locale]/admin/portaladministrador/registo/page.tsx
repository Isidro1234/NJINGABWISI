
"use client"
import CustomCard from '@/components/custom/CustomCard';
import CustomHouseRegisterForm from '@/components/custom/CustomHouseRegisterForm';
import TabsCustom from '@/components/custom/CustomTabc';
import Form1 from '@/components/custom/Form1';
import Form2 from '@/components/custom/Form2';
import { toaster, Toaster } from '@/components/ui/toaster';
import { decryptdata } from '@/logic/encryptdata';
import { useLogicState } from '@/states/useLogicState';
import { Button, HStack, Text, VStack } from '@chakra-ui/react';
import Image from 'next/image';
import React, { useRef, useState } from 'react'
import { useTranslations } from 'next-intl';

export default function Registar() {

    const t = useTranslations('registerProperty')

    const [form1, setform1] = useState<any>({});
    const [form2, setform2] = useState<any>({})
    const buttonref = useRef<HTMLElement>(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const register = useLogicState((state: any) => state?.registerhouse)

    async function clicking() {
        if (!buttonref.current) return
        const doc = buttonref.current.getElementsByTagName('button')
        const cur = currentIndex + 1
        if (cur < doc.length) {
            doc[cur].click()
        }
    }

    function clickinganterior() {
        if (!buttonref.current) return
        const doc = buttonref.current.getElementsByTagName('button')
        const cur = currentIndex - 1
        if (cur >= 0) {
            doc[cur].click()
        }
    }

    function validateForm1(): string | null {
        if (!form1?.primeiro_nome) return t('validation.firstName')
        if (!form1?.sobrenome) return t('validation.lastName')
        if (!form1?.utente_pais) return t('validation.country')
        if (!form1?.utente_estado) return t('validation.state')
        if (!form1?.utente_municipio) return t('validation.municipality')
        if (!form1?.utente_destrito) return t('validation.district')
        if (!form1?.utente_rua) return t('validation.street')
        if (!form1?.tipo_de_identificacao) return t('validation.idType')
        if (!form1?.numero_de_identificacao) return t('validation.idNumber')
        if (!form1?.fotos_de_identificacao?.length) return t('validation.idPhoto')
        return null
    }

    function validateForm2(): string | null {
        if (!form2?.utente_pais) return t('validation.propertyCountry')
        if (!form2?.utente_estado) return t('validation.propertyState')
        if (!form2?.utente_municipio) return t('validation.propertyMunicipality')
        if (!form2?.utente_distrito) return t('validation.propertyDistrict')
        if (!form2?.utente_rua) return t('validation.propertyStreet')
        if (!form2?.categoria_de_imovel) return t('validation.propertyCategory')
        if (!form2?.tipo_de_imovel) return t('validation.propertyType')
        if (!form2?.area_total_do_imove) return t('validation.propertyArea')
        if (!form2?.comprimento_da_propriedade) return t('validation.propertyLength')
        if (!form2?.largura_da_propriedade) return t('validation.propertyWidth')
        if (!form2?.fotos_da_propriedade?.length) return t('validation.propertyPhoto')

        const hasDocs = form2?.tenho_documentos === 'sim'
        if (hasDocs && !form2?.documentos_da_lista_de_documentos_completos?.length) {
            return t('validation.propertyDocs')
        }

        const hasFullDocs = form2?.tenho_documento_completo === 'sim'
        if (!hasFullDocs) {
            if (!form2?.data_da_compra_do_imove) return t('validation.purchaseDate')
            if (!form2?.dono_antigo) return t('validation.previousOwner')
            if (!form2?.nome_do_vendedor_ou_agente_imobiliario) return t('validation.agentName')
            if (!form2?.tipo_de_identificacao_do_dono_antigo) return t('validation.previousOwnerIdType')
            if (!form2?.numero_do_bilhete_ou_uip_do_dono_antigo) return t('validation.previousOwnerId')
        }

        const isGovOrInstitutional = ['governamental', 'institucional'].includes(form2?.categoria_de_imovel || '')
        if (isGovOrInstitutional && !form2?.numero_de_aprovacao_do_projecto) {
            return t('validation.projectApproval')
        }

        if (!form2?.numero_de_quartos && form2?.numero_de_quartos !== 0) return t('validation.rooms')
        if (!form2?.numero_de_cozinhas && form2?.numero_de_cozinhas !== 0) return t('validation.kitchens')
        if (!form2?.numero_de_salas && form2?.numero_de_salas !== 0) return t('validation.livingRooms')
        if (!form2?.numero_de_casas_de_banho && form2?.numero_de_casas_de_banho !== 0) return t('validation.bathrooms')

        return null
    }

    async function enviarForms() {

        if (currentIndex === 0) {
            const error = validateForm1()
            if (error) {
                toaster.create({
                    title: t('messages.incomplete'),
                    description: error,
                    type: 'error',
                    duration: 5000
                })
                return
            }
            clicking()
            return
        }

        if (currentIndex === 1) {
            const error = validateForm2()
            if (error) {
                toaster.create({
                    title: t('messages.incomplete'),
                    description: error,
                    type: 'error',
                    duration: 5000
                })
                return
            }
            clicking()
            return
        }

        if (currentIndex === 2) {

            const error1 = validateForm1()
            const error2 = validateForm2()

            if (error1 || error2) {
                toaster.create({
                    title: t('messages.incomplete'),
                    description: error1 || error2 || '',
                    type: 'error',
                    duration: 5000
                })
                return
            }

            const uip: string = localStorage.getItem('uip') || ''
            const uipadmin: string = localStorage.getItem('uipadmin') || ''
            const check = uip || uipadmin
            const decrypt = decryptdata(check)?.id

            if (!decrypt) {
                toaster.create({
                    title: t('messages.sessionExpired'),
                    description: t('messages.loginAgain'),
                    type: 'error',
                    duration: 5000
                })
                return
            }

            await register(form1, form2, decrypt)

            toaster.create({
                title: t('messages.propertyRegistered'),
                description: t('messages.requestSent'),
                type: 'success',
                duration: 5000
            })
        }
    }

    return (
        <VStack alignItems={'center'} padding={5} paddingTop={10} width={'100%'}>

            <CustomCard
                bg='#e9daf9'
                icon={<Image alt='icon' src={'/icons/registar.svg'} width={20} height={20} />}
                description='inta register'
                title={t('title')}
            >

                <VStack width={'100%'} gap={4}>

                    <TabsCustom
                        change={(e: any) => { setCurrentIndex(Number(e)) }}
                        buttonref={buttonref}

                        form1={
                            <CustomHouseRegisterForm
                                title={t('government')}
                                subtitle={t('ministry')}
                                typeOfform={t('formTitle')}
                            >
                                <VStack>
                                    <Form1 getform={(e: any) => { setform1(e) }} />
                                </VStack>
                            </CustomHouseRegisterForm>
                        }

                        form2={
                            <CustomHouseRegisterForm
                                title={t('government')}
                                subtitle={t('ministry')}
                                typeOfform={t('formTitle')}
                            >
                                <VStack>
                                    <Form2 getform2={(e: any) => { setform2(e) }} />
                                </VStack>
                            </CustomHouseRegisterForm>
                        }

                        preview={
                            <CustomHouseRegisterForm
                                title={t('government')}
                                subtitle={t('ministry')}
                                typeOfform={t('formTitle')}
                            >

                                <Text fontWeight={700}>
                                    {t('preview.title')}
                                </Text>

                            </CustomHouseRegisterForm>
                        }
                    />

                    <HStack justifyContent={'flex-end'} width={'100%'} marginTop={4} gap={2}>

                        <Button fontSize={12} borderRadius={50} bg={'blue'} onClick={clickinganterior}>
                            {t('buttons.previous')}
                        </Button>

                        <Button fontSize={12} borderRadius={50} bg={'blue'} onClick={enviarForms}>
                            {currentIndex >= 2 ? t('buttons.submit') : t('buttons.next')}
                        </Button>

                    </HStack>

                </VStack>
            </CustomCard>

            <Toaster />

        </VStack>
    )
}

