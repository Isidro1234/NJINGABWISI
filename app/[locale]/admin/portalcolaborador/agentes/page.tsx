
"use client"
import CustomHouseRegisterForm from '@/components/custom/CustomHouseRegisterForm'
import InputLabel from '@/components/custom/InputLabel'
import SelectCustomValue from '@/components/custom/SelectCustomValue'
import { Toaster, toaster } from '@/components/ui/toaster'
import { angola, municipos_angola } from '@/logic/countries'
import { decryptdata } from '@/logic/encryptdata'
import { store } from '@/logic/storemedia'
import { useLogicState } from '@/states/useLogicState'
import { Box, Button, Checkbox, HStack, Input, Text, VStack } from '@chakra-ui/react'
import { Country, State } from 'country-state-city'
import Image from 'next/image'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

const ANGOLA_CODES = ['AO', 'AGO']

export default function Agentes() {

  const t = useTranslations('agentes')

  const inputref = useRef<HTMLInputElement>(null)
  const registar_agente = useLogicState((state: any) => state.registar_agente)

  const [previewFiles, setPreviewFiles] = useState<File[]>([])
  const [formulario1, setformulario] = useState(() => ({
    pais: null,
    provincia: null,
    municipio: null,
    comuna: null,
    acitou_termos: null,
    identificacao: [],
    distrito: null,
    rua: null
  }))

  const countries = useMemo(() =>
    Country.getAllCountries().map((item) => ({ value: item.isoCode, label: item.name }))
    , [])

  const isAngola = useMemo(
    () => ANGOLA_CODES.includes(formulario1?.pais || ''),
    [formulario1?.pais]
  )

  const states = useMemo(() => {
    if (isAngola) return angola
    return State.getStatesOfCountry(formulario1?.pais || 'AF').map((item) => ({
      value: item.isoCode, label: item.name
    }))
  }, [formulario1.pais, isAngola])

  const municipios = useMemo(() => {
    const found = municipos_angola.find((item) => item?.province === formulario1.provincia)
    return found?.municipalities.map((m) => ({ value: m, label: m })) || []
  }, [formulario1.provincia])

  const comunas = useMemo(() => {
    for (const province of municipos_angola) {
      const found = province?.municipio.find((cm) => cm.nome === formulario1.municipio)
      if (found) return found.comunas.map((cm: any) => ({ value: cm, label: cm }))
    }
    return []
  }, [formulario1.municipio])

  const showComunas = comunas.length > 0 && comunas[0]?.value !== ''

  const set = useCallback((field: string) => (e: any) => {
    setformulario((prev) => ({ ...prev, [field]: e }))
  }, [])

  function download() {
    const crl = document.createElement('a')
    crl.href = 'https://njinga-worker.njinga.workers.dev/guia.pdf'
    crl.download = 'Livro-GUIA-PARA-AGENTES-&-INTERMEDIARIOS'
    document.body.appendChild(crl)
    crl.click()
    document.body.removeChild(crl)
  }

  function addFiles(files: FileList | null) {
    if (!files) return
    setPreviewFiles(prev => [...prev, ...Array.from(files)])
  }

  function deleteFile(name: string) {
    setPreviewFiles(prev => prev.filter((f) => f.name !== name))
  }

  function validate(): string | null {
    if (!formulario1.pais) return t('validation.country')
    if (!formulario1.provincia) return t('validation.state')
    if (!formulario1.municipio) return t('validation.municipality')
    if (!formulario1.distrito) return t('validation.district')
    if (!formulario1.rua) return t('validation.street')
    if (previewFiles.length === 0) return t('validation.documents')
    if (!formulario1.acitou_termos) return t('validation.terms')
    return null
  }

  async function process(file: File) {
    return await store({ image: file, name: file.name, type: file.type })
  }

  async function submit() {
    const error = validate()
    if (error) {
      toaster.create({ title: error, duration: 5000, type: 'error' })
      return
    }

    const docs = await Promise.all(previewFiles.map(process))
    const updatedForm = { ...formulario1, identificacao: docs || [] }
    await enviar(updatedForm)
  }

  async function enviar(form: any) {
    const decrypt: any = localStorage.getItem('uip')
    const uip = decryptdata(decrypt)?.id
    const res = await registar_agente(form, uip)

    if (res) {
      toaster.create({ title: t('messages.success'), duration: 5000, type: 'success' })
    } else {
      toaster.create({ title: t('messages.error'), duration: 5000, type: 'error' })
    }
  }

  const isImage = (file: File) => file.type.startsWith('image/')

  return (
    <VStack padding={10} width={'100%'} bg={'#f6f6f6'}>
      <Box bg={'white'} borderRadius={20} padding={10}>
        <CustomHouseRegisterForm
          title={t('form.title')}
          subtitle={t('form.subtitle')}
          typeOfform={t('form.type')}
        >

          <VStack width={'100%'} gap={4}>

            <HStack width={'100%'} display={'grid'} gridTemplateColumns={'repeat(auto-fit, minmax(250px, 1fr))'}>

              <Box display={'flex'} flexDirection={'column'} gap={1}>
                <Text fontSize={12} color={'gray'}>{t('fields.birth_country')}</Text>
                <SelectCustomValue setChange={(e: any) => setformulario((p) => ({ ...p, pais: e[0] }))}
                  borderRadius={0} width={'100%'} items={countries} />
              </Box>

              <Box display={'flex'} flexDirection={'column'} gap={1}>
                <Text fontSize={12} color={'gray'}>{t('fields.state')}</Text>
                <SelectCustomValue setChange={(e: any) => setformulario((p) => ({ ...p, provincia: e[0] }))}
                  borderRadius={0} width={'100%'} items={states} />
              </Box>

              {isAngola ? (
                <>
                  <Box display={'flex'} flexDirection={'column'} gap={1}>
                    <Text fontSize={12} color={'gray'}>{t('fields.municipality')}</Text>
                    <SelectCustomValue setChange={(e: any) => setformulario((p) => ({ ...p, municipio: e[0] }))}
                      borderRadius={0} width={'100%'} items={municipios} />
                  </Box>

                  <Box display={showComunas ? 'flex' : 'none'} flexDirection={'column'} gap={1}>
                    <Text fontSize={12} color={'gray'}>{t('fields.comuna')}</Text>
                    <SelectCustomValue setChange={(e: any) => setformulario((p) => ({ ...p, comuna: e[0] }))}
                      borderRadius={0} width={'100%'} items={comunas} />
                  </Box>
                </>
              ) : (
                <>
                  <InputLabel onchange={set('municipio')} type='text'
                    placeholder={t('fields.municipality')}
                    label={t('fields.municipality')} />

                  <InputLabel onchange={set('comuna')} type='text'
                    placeholder={t('fields.comuna')}
                    label={t('fields.comuna')} />
                </>
              )}

              <InputLabel onchange={set('distrito')} type='text'
                placeholder={t('fields.district')}
                label={t('fields.district')} />

              <InputLabel onchange={set('rua')} type='text'
                placeholder={t('fields.street')}
                label={t('fields.street')} />

            </HStack>

            <VStack marginTop={4} alignItems={'start'} width={'100%'}>
              <Text textDecoration={'underline'} fontSize={12} color={'gray'}>
                {t('terms.title')}
              </Text>

              <VStack width={'100%'} alignItems={'start'}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <Text key={i} maxWidth={370} fontSize={12} color={'gray'}>
                    {i + 1}. {t(`terms.items.${i + 1}`)}
                  </Text>
                ))}
              </VStack>

              <Checkbox.Root onCheckedChange={(e: any) => {
                setformulario((prev) => ({ ...prev, acitou_termos: e?.checked }))
              }}>
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label fontSize={12} color={'gray'}>
                  {t('terms.accept')}
                </Checkbox.Label>
              </Checkbox.Root>

              <Text fontSize={12} color={'gray'} marginTop={2}>
                {t('upload.description')}
              </Text>

              <Box
                cursor={'pointer'}
                borderStyle={'dashed'}
                alignItems={'center'}
                justifyContent={'center'}
                flexDirection={'column'}
                display={'flex'}
                borderRadius={12}
                borderWidth={2}
                borderColor={'gray.300'}
                padding={8}
                width={'100%'}
                gap={2}
                transition={'all 0.2s'}
                _hover={{ borderColor: 'blue.400', bg: 'blue.50' }}
                onClick={() => {
                  if (inputref.current) inputref.current.value = ''
                  inputref.current?.click()
                }}
              >
                <Box position={'relative'} width={8} height={10}>
                  <Image src={'/icons/file.svg'} fill alt='upload' />
                </Box>

                <Text color={'gray'} fontSize={12}>
                  {t('upload.drop')}
                </Text>

                <Text color={'gray.400'} fontSize={10}>
                  {t('upload.types')}
                </Text>

                <Input
                  onChange={(e) => addFiles(e.target.files)}
                  onClick={(e) => { (e.target as HTMLInputElement).value = '' }}
                  ref={inputref}
                  display={'none'}
                  type='file'
                  multiple
                  accept='image/*,.pdf'
                />
              </Box>

              <Text textDecoration={'underline'} fontSize={12} color={'gray'} marginTop={2}>
                {t('guide.title')}
              </Text>

              <Box onClick={download} cursor={'pointer'} position={'relative'}>
                <Image src={'/images/livro.png'} width={100} height={100} alt='livro-guia' />
                <Button color={'white'} bg={'#1cc995'} size={'2xs'}>
                  {t('guide.download')}
                </Button>
              </Box>

              <Button onClick={submit} bg={'blue'} width={'100%'} marginTop={2}>
                {t('buttons.submit')}
              </Button>

            </VStack>
          </VStack>
        </CustomHouseRegisterForm>
      </Box>

      <Toaster />
    </VStack>
  )
}
