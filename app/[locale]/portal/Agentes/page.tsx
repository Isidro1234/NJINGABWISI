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
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React, { useCallback, useMemo, useRef, useState } from 'react'

const ANGOLA_CODES = ['AO', 'AGO']

export default function Agentes() {
  const t = useTranslations('portal.agentes')
  const inputref = useRef<HTMLInputElement>(null)
  const registar_agente = useLogicState((state: any) => state.registar_agente)

  const [previewFiles, setPreviewFiles] = useState<File[]>([])
  const [formulario1, setformulario] = useState(() => ({
    pais: null, provincia: null, municipio: null, comuna: null,
    acitou_termos: null, identificacao: [], distrito: null, rua: null
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
    if (!formulario1.pais)            return t('errors.pais')
    if (!formulario1.provincia)       return t('errors.provincia')
    if (!formulario1.municipio)       return t('errors.municipio')
    if (!formulario1.distrito)        return t('errors.distrito')
    if (!formulario1.rua)             return t('errors.rua')
    if (previewFiles.length === 0)    return t('errors.docs')
    if (!formulario1.acitou_termos)   return t('errors.terms')
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
    await enviar({ ...formulario1, identificacao: docs || [] })
  }

  async function enviar(form: any) {
    const decrypt: any = localStorage.getItem('uip')
    const uip = decryptdata(decrypt)?.id
    const res = await registar_agente(form, uip)
    if (res) {
      toaster.create({ title: t('errors.submit_success'), duration: 5000, type: 'success' })
    } else {
      toaster.create({ title: t('errors.submit_error'), duration: 5000, type: 'error' })
    }
  }

  const isImage = (file: File) => file.type.startsWith('image/')

  const TERMS = ['t1','t2','t3','t4','t5','t6','t7','t8','t9','t10'] as const

  return (
    <VStack padding={10} width={'100%'} bg={'#f6f6f6'}>
      <Box bg={'white'} borderRadius={20} padding={10}>
        <CustomHouseRegisterForm
          title={t('form_title')}
          subtitle={t('form_subtitle')}
          typeOfform={t('form_type')}
        >
          <VStack width={'100%'} gap={4}>

            {/* ── Location ── */}
            <HStack width={'100%'} display={'grid'} gridTemplateColumns={'repeat(auto-fit, minmax(250px, 1fr))'}>
              <Box display={'flex'} flexDirection={'column'} gap={1}>
                <Text fontSize={12} color={'gray'}>{t('country_label')}</Text>
                <SelectCustomValue setChange={(e: any) => setformulario((p) => ({ ...p, pais: e[0] }))}
                  borderRadius={0} width={'100%'} items={countries} />
              </Box>
              <Box display={'flex'} flexDirection={'column'} gap={1}>
                <Text fontSize={12} color={'gray'}>{t('state_label')}</Text>
                <SelectCustomValue setChange={(e: any) => setformulario((p) => ({ ...p, provincia: e[0] }))}
                  borderRadius={0} width={'100%'} items={states} />
              </Box>
              {isAngola ? (
                <>
                  <Box display={'flex'} flexDirection={'column'} gap={1}>
                    <Text fontSize={12} color={'gray'}>{t('municipality_label')}</Text>
                    <SelectCustomValue setChange={(e: any) => setformulario((p) => ({ ...p, municipio: e[0] }))}
                      borderRadius={0} width={'100%'} items={municipios} />
                  </Box>
                  <Box display={showComunas ? 'flex' : 'none'} flexDirection={'column'} gap={1}>
                    <Text fontSize={12} color={'gray'}>{t('comuna_label')}</Text>
                    <SelectCustomValue setChange={(e: any) => setformulario((p) => ({ ...p, comuna: e[0] }))}
                      borderRadius={0} width={'100%'} items={comunas} />
                  </Box>
                </>
              ) : (
                <>
                  <InputLabel onchange={set('municipio')} type='text'
                    placeholder={t('municipality_placeholder')} label={t('municipality_label')} />
                  <InputLabel onchange={set('comuna')} type='text'
                    placeholder={t('comuna_placeholder')} label={t('comuna_label')} />
                </>
              )}
              <InputLabel onchange={set('distrito')} type='text'
                placeholder={t('distrito_placeholder')} label={t('distrito_placeholder')} />
              <InputLabel onchange={set('rua')} type='text'
                placeholder={t('rua_placeholder')} label={t('rua_placeholder')} />
            </HStack>

            {/* ── Terms ── */}
            <VStack marginTop={4} alignItems={'start'} width={'100%'}>
              <Text textDecoration={'underline'} fontSize={12} color={'gray'}>
                {t('terms_title')}
              </Text>
              <VStack width={'100%'} alignItems={'start'}>
                {TERMS.map((key, i) => (
                  <Text key={key} maxWidth={370} fontSize={12} color={'gray'}>
                    {i + 1}. {t(`terms.${key}`)}
                  </Text>
                ))}
              </VStack>

              <Checkbox.Root onCheckedChange={(e: any) => setformulario((prev) => ({ ...prev, acitou_termos: e?.checked }))}>
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label fontSize={12} color={'gray'}>{t('accept_terms')}</Checkbox.Label>
              </Checkbox.Root>

              {/* ── Upload ── */}
              <Text fontSize={12} color={'gray'} marginTop={2}>{t('upload_label')}</Text>
              <Box
                cursor={'pointer'} borderStyle={'dashed'} alignItems={'center'}
                justifyContent={'center'} flexDirection={'column'} display={'flex'}
                borderRadius={12} borderWidth={2} borderColor={'gray.300'}
                padding={8} width={'100%'} gap={2} transition={'all 0.2s'}
                _hover={{ borderColor: 'blue.400', bg: 'blue.50' }}
                onClick={() => { if (inputref.current) inputref.current.value = ''; inputref.current?.click() }}
              >
                <Box position={'relative'} width={8} height={10}>
                  <Image src={'/icons/file.svg'} fill alt='upload' />
                </Box>
                <Text color={'gray'} fontSize={12}>{t('upload_hint')}</Text>
                <Text color={'gray.400'} fontSize={10}>{t('upload_formats')}</Text>
                <Input
                  onChange={(e) => addFiles(e.target.files)}
                  onClick={(e) => { (e.target as HTMLInputElement).value = '' }}
                  ref={inputref} display={'none'} type='file' multiple accept='image/*,.pdf'
                />
              </Box>

              {/* ── File preview ── */}
              {previewFiles.length > 0 && (
                <Box width={'100%'} display={'grid'}
                  gridTemplateColumns={'repeat(auto-fill, minmax(110px, 1fr))'} gap={3} marginTop={2}>
                  {previewFiles.map((file, index) => (
                    <VStack key={index} position={'relative'} borderWidth={1} borderRadius={10}
                      overflow={'hidden'} bg={'white'} boxShadow={'sm'} gap={0}>
                      <Box position={'absolute'} top={1} right={1} zIndex={10} bg={'red.500'}
                        borderRadius={'full'} width={5} height={5} display={'flex'}
                        alignItems={'center'} justifyContent={'center'} cursor={'pointer'}
                        onClick={() => deleteFile(file.name)} _hover={{ bg: 'red.600' }}>
                        <Text fontSize={10} color={'white'} lineHeight={1}>✕</Text>
                      </Box>
                      <Box width={'100%'} height={'75px'} position={'relative'} bg={'gray.50'}>
                        {isImage(file) ? (
                          <Image src={URL.createObjectURL(file)} fill alt={file.name} style={{ objectFit: 'cover' }} />
                        ) : (
                          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} height={'100%'}>
                            <Box position={'relative'} width={8} height={10}>
                              <Image src={'/icons/file.svg'} fill alt='file' />
                            </Box>
                          </Box>
                        )}
                      </Box>
                      <Box padding={2} width={'100%'}>
                        <Text fontSize={10} color={'gray'} overflow={'hidden'}
                          textOverflow={'ellipsis'} whiteSpace={'nowrap'} title={file.name}>
                          {file.name}
                        </Text>
                        <Text fontSize={9} color={'gray.400'}>
                          {(file.size / 1024).toFixed(0)} KB
                        </Text>
                      </Box>
                    </VStack>
                  ))}
                </Box>
              )}

              {/* ── Guide book ── */}
              <Text textDecoration={'underline'} fontSize={12} color={'gray'} marginTop={2}>
                {t('guide_label')}
              </Text>
              <Box onClick={download} cursor={'pointer'} position={'relative'}>
                <Image src={'/images/livro.png'} width={100} height={100} alt='livro-guia' />
                <Button color={'white'} bg={'#1cc995'} size={'2xs'}>{t('download_book')}</Button>
              </Box>

              <Button onClick={submit} bg={'blue'} width={'100%'} marginTop={2}>
                {t('submit')}
              </Button>
            </VStack>
          </VStack>
        </CustomHouseRegisterForm>
      </Box>
      <Toaster />
    </VStack>
  )
}