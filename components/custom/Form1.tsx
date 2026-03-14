'use client'
import { Box, Button, HStack, Input, Text, VStack } from '@chakra-ui/react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import InputLabel from './InputLabel'
import SelectCustomValue from './SelectCustomValue'
import { Country, State } from 'country-state-city'
import { angola, municipos_angola } from '@/logic/countries'
import { store } from '@/logic/storemedia'
import Image from 'next/image'

interface Form1Props {
  getform: Function
}

const IDENTIFICATION_ITEMS = [
  { value: 'passaporte', label: 'Passaporte' },
  { value: 'bilhete', label: 'Bilhete' }
]

const ANGOLA_CODES = ['AO', 'AGO']

export default function Form1({ getform }: Form1Props) {
  const [formulario1, setformulario1] = useState({
    primeiro_nome: null,
    nome_do_meio: null,
    sobrenome: null,
    utente_pais: null,
    utente_estado: null,
    utente_municipio: null,
    utente_comuna: null,
    utente_destrito: null,
    utente_rua: null,
    tipo_de_identificacao: null,
    numero_de_identificacao: null,
    fotos_de_identificacao: [] as any[],
  })

  // Local file list for preview — keeps File objects separate from uploaded URLs
  const [previewFiles, setPreviewFiles] = useState<File[]>([])

  const photoref = useRef<HTMLInputElement>(null)

  const getformRef = useRef(getform)
  useEffect(() => { getformRef.current = getform }, [getform])

  useEffect(() => {
    const timeout = setTimeout(() => {
      getformRef.current(formulario1)
    }, 300)
    return () => clearTimeout(timeout)
  }, [formulario1])

  const countries = useMemo(() => {
    return Country.getAllCountries().map((item) => ({
      value: item.isoCode,
      label: item.name
    }))
  }, [])

  const isAngola = useMemo(
    () => ANGOLA_CODES.includes(formulario1.utente_pais || ""),
    [formulario1.utente_pais]
  )

  const states = useMemo(() => {
    if (isAngola) return angola
    return State.getStatesOfCountry(formulario1.utente_pais || 'AF').map((item) => ({
      value: item.isoCode,
      label: item.name
    }))
  }, [formulario1.utente_pais, isAngola])

  const municipios = useMemo(() => {
    const found = municipos_angola.find((item) => item?.province === formulario1.utente_estado)
    return found?.municipalities.map((m) => ({ value: m, label: m })) || []
  }, [formulario1.utente_estado])

  const comunas = useMemo(() => {
    for (const province of municipos_angola) {
      const found = province?.municipio.find((cm) => cm.nome === formulario1.utente_municipio)
      if (found) return found.comunas.map((cm: any) => ({ value: cm, label: cm }))
    }
    return []
  }, [formulario1.utente_municipio])

  const showComunas = comunas.length > 0 && comunas[0]?.value !== ''

  const set = useCallback((field: string) => (e: any) => {
    setformulario1((prev) => ({ ...prev, [field]: e }))
  }, [])

  const processfile = useCallback(async (file: File): Promise<any> => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    const storemedia: any = await store({ image: file, name: file.name, type: file.type })
    return storemedia
  }, [])

  const enviarDocs = useCallback(async (files: FileList | null) => {
    if (!files) return
    const filesArray = Array.from(files)
    setPreviewFiles(prev => [...prev, ...filesArray])
    const result = await Promise.all(filesArray.map(processfile))
    setformulario1((prev) => ({
      ...prev,
      fotos_de_identificacao: [...prev.fotos_de_identificacao, ...result]
    }))
  }, [processfile])

  // ✅ Remove file by index — keeps preview and uploaded URLs in sync
  const deleteFile = useCallback((index: number) => {
    setPreviewFiles(prev => prev.filter((_, i) => i !== index))
    setformulario1(prev => ({
      ...prev,
      fotos_de_identificacao: prev.fotos_de_identificacao.filter((_, i) => i !== index)
    }))
  }, [])

  const isImage = (file: File) => file.type.startsWith('image/')

  return (
    <VStack width={'100%'}>
      <Text margin={4} fontSize={12} color={'gray'}>
        Por favor certifique-se de que as informações inseridas são verdadeiras
      </Text>

      <HStack width={'100%'}>
        <InputLabel onchange={set('primeiro_nome')} type='text' placeholder='Primeiro nome' label='Primeiro Nome' />
        <InputLabel onchange={set('nome_do_meio')} type='text' placeholder='Nome do meio' label='Nome do Meio' />
        <InputLabel onchange={set('sobrenome')} type='text' placeholder='Sobrenome' label='Sobrenome' />
      </HStack>

      <Text width={'100%'} textAlign={'center'} fontSize={12} fontWeight={500}>Residência</Text>

      <HStack width={'100%'} display={'grid'} gridTemplateColumns={'repeat(auto-fit, minmax(250px, 1fr))'}>
        <Box display={'flex'} flexDirection={'column'} gap={1}>
          <Text fontSize={12} color={'gray'}>País de Nascimento</Text>
          <SelectCustomValue setChange={(e: any) => setformulario1((p) => ({ ...p, utente_pais: e[0] }))}
            borderRadius={0} width={'100%'} items={countries} />
        </Box>

        <Box display={'flex'} flexDirection={'column'} gap={1}>
          <Text fontSize={12} color={'gray'}>Estado/Província</Text>
          <SelectCustomValue setChange={(e: any) => setformulario1((p) => ({ ...p, utente_estado: e[0] }))}
            borderRadius={0} width={'100%'} items={states} />
        </Box>

        {isAngola ? (
          <>
            <Box display={'flex'} flexDirection={'column'} gap={1}>
              <Text fontSize={12} color={'gray'}>Município</Text>
              <SelectCustomValue setChange={(e: any) => setformulario1((p) => ({ ...p, utente_municipio: e[0] }))}
                borderRadius={0} width={'100%'} items={municipios} />
            </Box>
            <Box display={showComunas ? 'flex' : 'none'} flexDirection={'column'} gap={1}>
              <Text fontSize={12} color={'gray'}>Comuna</Text>
              <SelectCustomValue setChange={(e: any) => setformulario1((p) => ({ ...p, utente_comuna: e[0] }))}
                borderRadius={0} width={'100%'} items={comunas} />
            </Box>
          </>
        ) : (
          <>
            <InputLabel onchange={set('utente_municipio')} type='text' placeholder='Município' label='Município' />
            <InputLabel onchange={set('utente_comuna')} type='text' placeholder='Comuna' label='Comuna' />
          </>
        )}

        <InputLabel onchange={set('utente_destrito')} type='text' placeholder='Distrito' label='Distrito' />
        <InputLabel onchange={set('utente_rua')} type='text' placeholder='Rua' label='Rua' />
      </HStack>

      <Text width={'100%'} color={'gray'} textAlign={'center'} fontSize={12} fontWeight={500}>
        Identificação do Utente
      </Text>

      <HStack width={'100%'}>
        <Box display={'flex'} flexDirection={'column'} gap={1} width={'100%'}>
          <Text fontSize={12} color={'gray'}>Tipo de Identificação</Text>
          <SelectCustomValue setChange={(e: any) => setformulario1((p) => ({ ...p, tipo_de_identificacao: e[0] }))}
            borderRadius={0} width={'100%'} items={IDENTIFICATION_ITEMS} />
        </Box>
        <InputLabel onchange={set('numero_de_identificacao')} type='text'
          placeholder='Número do documento' label='Identificação' />
      </HStack>

      {/* ── Document upload + preview ── */}
      <VStack width={'100%'} gap={3} alignItems={'start'}>
        <Text fontSize={12} color={'gray'}>Passaporte / Bilhete de Identidade</Text>

        {/* Drop zone */}
        <Box
          onClick={() => photoref.current?.click()}
          cursor={'pointer'}
          width={'100%'}
          borderWidth={2}
          borderStyle={'dashed'}
          borderColor={'gray.300'}
          borderRadius={12}
          padding={6}
          display={'flex'}
          flexDirection={'column'}
          alignItems={'center'}
          gap={2}
          transition={'all 0.2s'}
          _hover={{ borderColor: 'blue.400', bg: 'blue.50' }}
        >
          <Input
            multiple
            ref={photoref}
            type='file'
            display={'none'}
            accept='image/*,.pdf'
            onClick={(e) => { (e.target as HTMLInputElement).value = '' }}
            onChange={(e) => enviarDocs(e.target.files)}
          />
          <Box position={'relative'} width={8} height={8}>
            <Image src={'/icons/file.svg'} fill alt='upload' />
          </Box>
          <Text fontSize={12} color={'gray'} textAlign={'center'}>
            Clique para seleccionar ou arraste os ficheiros aqui
          </Text>
          <Text fontSize={10} color={'gray.400'}>
            Suporta: JPG, PNG, PDF
          </Text>
        </Box>

        {/* Preview grid */}
        {previewFiles.length > 0 && (
          <Box
            width={'100%'}
            display={'grid'}
            gridTemplateColumns={'repeat(auto-fill, minmax(120px, 1fr))'}
            gap={3}
          >
            {previewFiles.map((file, index) => (
              <VStack
                key={index}
                position={'relative'}
                borderWidth={1}
                borderRadius={10}
                overflow={'hidden'}
                bg={'white'}
                boxShadow={'sm'}
                gap={0}
              >
                {/* ✅ Delete button */}
                <Box
                  position={'absolute'}
                  top={1}
                  right={1}
                  zIndex={10}
                  bg={'red.500'}
                  borderRadius={'full'}
                  width={5}
                  height={5}
                  display={'flex'}
                  alignItems={'center'}
                  justifyContent={'center'}
                  cursor={'pointer'}
                  onClick={() => deleteFile(index)}
                  _hover={{ bg: 'red.600' }}
                >
                  <Text fontSize={10} color={'white'} lineHeight={1}>✕</Text>
                </Box>

                {/* ✅ Image preview or file icon */}
                <Box width={'100%'} height={'80px'} position={'relative'} bg={'gray.50'}>
                  {isImage(file) ? (
                    <Image
                      src={URL.createObjectURL(file)}
                      fill
                      alt={file.name}
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} height={'100%'}>
                      <Box position={'relative'} width={8} height={10}>
                        <Image src={'/icons/file.svg'} fill alt='file' />
                      </Box>
                    </Box>
                  )}
                </Box>

                {/* File name */}
                <Box padding={2} width={'100%'}>
                  <Text
                    fontSize={10}
                    color={'gray'}
                    overflow={'hidden'}
                    textOverflow={'ellipsis'}
                    whiteSpace={'nowrap'}
                    title={file.name}
                  >
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
      </VStack>
    </VStack>
  )
}
