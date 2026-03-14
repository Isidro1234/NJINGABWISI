'use client'
import { Box, Button, HStack, Input, Text, VStack } from '@chakra-ui/react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import InputLabel from './InputLabel'
import SelectCustomValue from './SelectCustomValue'
import { Country, State } from 'country-state-city'
import { angola, municipos_angola } from '@/logic/countries'
import { store } from '@/logic/storemedia'
import Image from 'next/image'
import DropZone from './DropZone'

// Static constants outside component — never recreated on render
const ANGOLA_CODES = ['AO', 'AGO']
const SIM_NAO = [{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não' }]
const CATEGORIA_ITEMS = [
  { value: 'residencial', label: 'Residencial' },
  { value: 'comercial', label: 'Comercial' },
  { value: 'governamental', label: 'Governamental' },
  { value: 'institucional', label: 'Institucional' }
]
const TIPO_IMOVEL_ITEMS = [
  { value: 'Casa', label: 'Casa' },
  { value: 'fazenda', label: 'Fazenda' },
  { value: 'apartamento', label: 'Apartamento' },
  { value: 'terreno', label: 'Terreno' },
  { value: 'imovel comercial loja', label: 'Imóvel Comercial - Loja' },
  { value: 'imovel comercial empresa', label: 'Imóvel Comercial - Empresa' }
]
const TIPO_ID_ITEMS = [
  { value: 'uip', label: 'UIP' },
  { value: 'bilhete de identidade', label: 'Bilhete de Identidade' }
]
const DOCUMENTOS_NECESSARIOS = [
  'Formulário de requisição do Registo Predial.',
  'Escritura pública de compra e venda.',
  'Certidão Matricial e certidão da fracção autónoma.',
  'Termo de Quitação (prova de pagamento total).',
  'Comprovativo de pagamento do IP (Imposto Predial).',
  'Cópia do B.I. do adquirente e do transmitente.',
  'Registo de construção/loteamento (em nome do promotor).',
  'Documentos da empresa promotora (Certidão comercial e publicação em Diário da República).'
]

interface Form2Props {
  getform2: Function
}

// ── Reusable file preview grid ──────────────────────────────────────────────
function FilePreviewGrid({
  files,
  onDelete
}: {
  files: File[]
  onDelete: (index: number) => void
}) {
  if (files.length === 0) return null
  const isImage = (file: File) => file.type.startsWith('image/')

  return (
    <Box
      width={'100%'}
      display={'grid'}
      gridTemplateColumns={'repeat(auto-fill, minmax(110px, 1fr))'}
      gap={3}
      marginTop={2}
    >
      {files.map((file, index) => (
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
          {/* Delete button */}
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
            onClick={() => onDelete(index)}
            _hover={{ bg: 'red.600' }}
          >
            <Text fontSize={10} color={'white'} lineHeight={1}>✕</Text>
          </Box>

          {/* Thumbnail or file icon */}
          <Box width={'100%'} height={'75px'} position={'relative'} bg={'gray.50'}>
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

          {/* Name + size */}
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
  )
}



export default function Form2({ getform2 }: Form2Props) {
  const inputref1 = useRef<HTMLInputElement>(null)
  const inputref2 = useRef<HTMLInputElement>(null)
  const inputref3 = useRef<HTMLInputElement>(null)
  const inputref4 = useRef<HTMLInputElement>(null)

  const [quartos, setquartos] = useState('')
  const [numeros, setnumeros] = useState(0)

  // ── Local file previews — one per upload zone ──────────────────────────────
  const [prevTodos, setPrevTodos] = useState<File[]>([])
  const [prevFotos, setPrevFotos] = useState<File[]>([])
  const [prevAlguns, setPrevAlguns] = useState<File[]>([])
  const [prevImovel, setPrevImovel] = useState<File[]>([])

  const [formulario2, setformulario2] = useState({
    utente_pais: null,
    utente_estado: null,
    utente_municipio: null,
    utente_comuna: null,
    utente_distrito: null,
    utente_rua: null,
    sou_dono_do_imovel: 'sim',
    sou_agente_imobiliario: null,
    tenho_documento_completo: 'sim',
    tenho_documentos: 'sim',
    categoria_de_imovel: null,
    verificar_uip: null,
    documentos_da_lista_de_documentos_completos: [] as any[],
    data_da_compra_do_imove: null,
    dono_antigo: null,
    novo_dono: null,
    nome_do_vendedor_ou_agente_imobiliario: null,
    tipo_de_identificacao_do_dono_antigo: null,
    foto_da_identificacao_do_dono_antigo: [] as any[],
    numero_do_bilhete_ou_uip_do_dono_antigo: null,
    tipo_de_imovel: null,
    numero_de_aprovacao_do_projecto: null,
    area_total_do_imove: null,
    comprimento_da_propriedade: null,
    largura_da_propriedade: null,
    fotos_da_propriedade: [] as any[],
    tenho_alguns_documentos: [] as any[],
    numero_de_quartos: 0,
    numero_de_cozinhas: 0,
    numero_de_salas: 0,
    numero_de_casas_de_banho: 0,
    imovel_tem_mais_quartos: false,
    quartos_adicionais: [{ quarto: '', numero: 0 }] as Array<{ quarto: string; numero: number }>
  })

  const getform2Ref = useRef(getform2)
  useEffect(() => { getform2Ref.current = getform2 }, [getform2])

  useEffect(() => {
    const timeout = setTimeout(() => {
      getform2Ref.current(formulario2)
    }, 300)
    return () => clearTimeout(timeout)
  }, [formulario2])

  const countries = useMemo(() =>
    Country.getAllCountries().map((c) => ({ value: c.isoCode, label: c.name }))
  , [])

  const isAngola = useMemo(
    () => ANGOLA_CODES.includes(formulario2?.utente_pais || ''),
    [formulario2.utente_pais]
  )

  const states = useMemo(() => {
    if (isAngola) return angola
    return State.getStatesOfCountry(formulario2?.utente_pais || '').map((s) => ({
      value: s.isoCode, label: s.name
    }))
  }, [formulario2.utente_pais, isAngola])

  const municipios = useMemo(() => {
    const found = municipos_angola.find((p) => p?.province === formulario2.utente_estado)
    return found?.municipalities.map((m) => ({ value: m, label: m })) || []
  }, [formulario2.utente_estado])

  const comunas = useMemo(() => {
    for (const province of municipos_angola) {
      const found = province?.municipio.find((cm) => cm.nome === formulario2.utente_municipio)
      if (found) return found.comunas.map((cm: any) => ({ value: cm, label: cm }))
    }
    return []
  }, [formulario2.utente_municipio])

  const showComunas = comunas.length > 0 && comunas[0]?.value !== ''
  const isOwner = formulario2.sou_dono_do_imovel === 'sim'
  const isAgent = formulario2.sou_agente_imobiliario === 'sim'
  const hasFullDocs = formulario2.tenho_documento_completo === 'sim'
  const hasDocs = formulario2.tenho_documentos === 'sim'
  const isGovOrInstitutional = ['governamental', 'institucional'].includes(formulario2?.categoria_de_imovel || '')

  const set = useCallback((field: string) => (e: any) => {
    setformulario2((prev) => ({ ...prev, [field]: e }))
  }, [])

  const processdocs = useCallback(async (file: File): Promise<any> => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    return await store({ image: file, name: file.name, type: file.type })
  }, [])

  // ── Generic upload handler — updates both local preview and form state ──────
  const handleUpload = useCallback(async (
    files: FileList | null,
    field: string,
    setPreview: React.Dispatch<React.SetStateAction<File[]>>
  ) => {
    if (!files) return
    const arr = Array.from(files)
    setPreview(prev => [...prev, ...arr])
    const result = await Promise.all(arr.map(processdocs))
    setformulario2(prev => ({ ...prev, [field]: [...(prev as any)[field], ...result] }))
  }, [processdocs])

  // ── Delete handler — removes by index from both preview and form state ──────
  const handleDelete = useCallback((
    index: number,
    field: string,
    setPreview: React.Dispatch<React.SetStateAction<File[]>>
  ) => {
    setPreview(prev => prev.filter((_, i) => i !== index))
    setformulario2(prev => ({
      ...prev,
      [field]: (prev as any)[field].filter((_: any, i: number) => i !== index)
    }))
  }, [])

  function addquartos() {
    setformulario2((prev) => ({
      ...prev,
      quartos_adicionais: [...prev.quartos_adicionais, { quarto: quartos, numero: numeros }]
    }))
  }

  function aparquartosadicionais(nome: string) {
    setformulario2((prev) => ({
      ...prev,
      quartos_adicionais: prev.quartos_adicionais.filter((q) => q.quarto !== nome)
    }))
  }

  return (
    <VStack width={'100%'} gap={3}>

      {/* ── Localização ── */}
      <Text color={'gray'} fontSize={12}>Localização do Imóvel</Text>
      <HStack width={'100%'} display={'grid'} gridTemplateColumns={'repeat(auto-fit, minmax(200px, 1fr))'}>
        <Box gap={2} display={'flex'} flexDirection={'column'}>
          <Text color={'gray'} fontSize={12}>País</Text>
          <SelectCustomValue items={countries}
            setChange={(e: any) => setformulario2((p) => ({ ...p, utente_pais: e[0] }))}
            width='100%' borderRadius={0} />
        </Box>
        <Box gap={2} display={'flex'} flexDirection={'column'}>
          <Text color={'gray'} fontSize={12}>Estado/Província</Text>
          <SelectCustomValue items={states}
            setChange={(e: any) => setformulario2((p) => ({ ...p, utente_estado: e[0] }))}
            width='100%' borderRadius={0} />
        </Box>
        <Box gap={2} display={'flex'} flexDirection={'column'}>
          <Text color={'gray'} fontSize={12}>Município</Text>
          <SelectCustomValue items={municipios}
            setChange={(e: any) => setformulario2((p) => ({ ...p, utente_municipio: e[0] }))}
            width='100%' borderRadius={0} />
        </Box>
        {showComunas && (
          <Box gap={2} display={'flex'} flexDirection={'column'}>
            <Text color={'gray'} fontSize={12}>Comuna</Text>
            <SelectCustomValue items={comunas}
              setChange={(e: any) => setformulario2((p) => ({ ...p, utente_comuna: e[0] }))}
              width='100%' borderRadius={0} />
          </Box>
        )}
        <InputLabel type='text' placeholder='Distrito' onchange={set('utente_distrito')} label='Distrito' />
        <InputLabel type='text' placeholder='Rua' onchange={set('utente_rua')} label='Rua' />
      </HStack>

      {/* ── Posse ── */}
      <Text textAlign={'center'} width={'100%'} color={'gray'} fontSize={12}>Posse de Imóvel</Text>
      <VStack width={'100%'} alignItems={'start'}>
        <Text color={'gray'} fontSize={12}>Este imóvel te pertence?</Text>
        <SelectCustomValue setChange={(e: any) => setformulario2((p) => ({ ...p, sou_dono_do_imovel: e[0] }))}
          items={SIM_NAO} width='100%' borderRadius={0} />
      </VStack>

      {!isOwner && (
        <VStack width={'100%'}>
          <Text width={'100%'} color={'gray'} fontSize={12}>O senhor é um agente imobiliário ou intermediário?</Text>
          <SelectCustomValue setChange={(e: any) => setformulario2((p) => ({ ...p, sou_agente_imobiliario: e[0] }))}
            items={SIM_NAO} width='100%' borderRadius={0} />
          {isAgent && (
            <InputLabel placeholder='Digite seu UIP' type='text' onchange={set('verificar_uip')} label='Verifique seu UIP' />
          )}
        </VStack>
      )}

      {/* ── Documentos de posse ── */}
      <VStack width={'100%'} alignItems={'start'}>
        <Text color={'gray'} fontSize={12}>O senhor tem algum documento que comprova sua posse desse imóvel?</Text>
        <SelectCustomValue setChange={(e: any) => setformulario2((p) => ({ ...p, tenho_documentos: e[0] }))}
          items={SIM_NAO} width='100%' borderRadius={0} />
        {hasDocs && (
          <VStack width={'100%'} gap={2}>
            <DropZone
              label='Clique ou arraste os documentos de posse aqui'
              inputRef={inputref1}
              onChange={(files) => handleUpload(files, 'documentos_da_lista_de_documentos_completos', setPrevTodos)}
            />
            <FilePreviewGrid
              files={prevTodos}
              onDelete={(i) => handleDelete(i, 'documentos_da_lista_de_documentos_completos', setPrevTodos)}
            />
          </VStack>
        )}
      </VStack>

      {hasFullDocs && (
        <VStack width={'100%'}>
          <Text color={'gray'} fontSize={12}>O senhor possui os documentos listados abaixo?</Text>
          <SelectCustomValue setChange={(e: any) => setformulario2((p) => ({ ...p, tenho_documento_completo: e[0] }))}
            items={SIM_NAO} width='100%' borderRadius={0} />
          <VStack width={'100%'} alignItems={'start'}>
            <Text fontSize={12} fontWeight={700}>Documentos necessários</Text>
            {DOCUMENTOS_NECESSARIOS.map((doc, i) => (
              <Text key={i} fontSize={12} color={'gray'}>{doc}</Text>
            ))}
          </VStack>
          <VStack width={'100%'} gap={2}>
            <DropZone
              label='Clique ou arraste os documentos completos aqui'
              inputRef={inputref2}
              onChange={(files) => handleUpload(files, 'foto_da_identificacao_do_dono_antigo', setPrevFotos)}
            />
            <FilePreviewGrid
              files={prevFotos}
              onDelete={(i) => handleDelete(i, 'foto_da_identificacao_do_dono_antigo', setPrevFotos)}
            />
          </VStack>
        </VStack>
      )}

      {!hasFullDocs && (
        <>
          <VStack width={'100%'}>
            <Text fontSize={12} color={'gray'}>Questões de verificação de posse</Text>
            <InputLabel onchange={set('data_da_compra_do_imove')} type='date'
              placeholder='Data de obtenção do imóvel' label='Quando o senhor comprou este imóvel' />
            <InputLabel onchange={set('nome_do_vendedor_ou_agente_imobiliario')} type='text'
              placeholder='Nome do intermediário/agência' label='Nome do vendedor do imóvel' />
            <InputLabel onchange={set('dono_antigo')} type='text'
              placeholder='Nome do/a dono/a anterior' label='Nome do/a anterior dono/a do imóvel' />
            {isAgent && (
              <InputLabel onchange={set('novo_dono')} type='text'
                placeholder='Nome do/a novo/a dono/a' label='Nome do/a novo/a dono/a do imóvel' />
            )}
          </VStack>

          <VStack width={'100%'}>
            <Text fontSize={12} color={'gray'}>Identificação das partes</Text>
            <Text fontSize={12} color={'gray'}>Forma de identificação do dono anterior</Text>
            <SelectCustomValue setChange={(e: any) => setformulario2((p) => ({ ...p, tipo_de_identificacao_do_dono_antigo: e[0] }))}
              items={TIPO_ID_ITEMS} width='100%' borderRadius={0} />
            <InputLabel onchange={set('numero_do_bilhete_ou_uip_do_dono_antigo')} type='text'
              placeholder='Número do BI ou UIP do dono anterior' label='Número do Bilhete / UIP' />
            <VStack width={'100%'} gap={2}>
              <DropZone
                label='Clique ou arraste as fotos do UIP / Bilhete do dono anterior'
                inputRef={inputref3}
                onChange={(files) => handleUpload(files, 'tenho_alguns_documentos', setPrevAlguns)}
              />
              <FilePreviewGrid
                files={prevAlguns}
                onDelete={(i) => handleDelete(i, 'tenho_alguns_documentos', setPrevAlguns)}
              />
            </VStack>
          </VStack>
        </>
      )}

      {/* ── Categoria e Tipo ── */}
      <Text fontSize={12} color={'gray'}>Categoria de Imóvel</Text>
      <SelectCustomValue setChange={(e: any) => setformulario2((p) => ({ ...p, categoria_de_imovel: e[0] }))}
        items={CATEGORIA_ITEMS} width='100%' borderRadius={0} />

      <Text color={'gray'} fontSize={12}>Tipo de Imóvel</Text>
      <SelectCustomValue setChange={(e: any) => setformulario2((p) => ({ ...p, tipo_de_imovel: e[0] }))}
        items={TIPO_IMOVEL_ITEMS} width='100%' borderRadius={0} />

      {isGovOrInstitutional && (
        <InputLabel onchange={set('numero_de_aprovacao_do_projecto')} type='text'
          placeholder='Número de aprovação do projecto' label='Número de Aprovação do Projecto' />
      )}

      {/* ── Dimensões ── */}
      <Text fontSize={12} color={'gray'}>Dimensão do Imóvel</Text>
      <InputLabel onchange={set('area_total_do_imove')} type='text'
        placeholder='Superfície total em m²' label='Superfície Total (m²)' />
      <InputLabel onchange={set('comprimento_da_propriedade')} type='text'
        placeholder='Comprimento em metros' label='Comprimento (m)' />
      <InputLabel onchange={set('largura_da_propriedade')} type='text'
        placeholder='Largura em metros' label='Largura (m)' />

      {/* ── Divisão estrutural ── */}
      <VStack width={'100%'}>
        <Text fontSize={12}>Divisão Estrutural do Imóvel</Text>
        <HStack width={'100%'} display={'grid'} gridTemplateColumns={'repeat(auto-fit, minmax(180px, 1fr))'}>
          <InputLabel onchange={set('numero_de_quartos')} type='number'
            placeholder='Nº de quartos' label='Quartos' />
          <InputLabel onchange={set('numero_de_cozinhas')} type='number'
            placeholder='Nº de cozinhas' label='Cozinhas' />
          <InputLabel onchange={set('numero_de_salas')} type='number'
            placeholder='Nº de salas' label='Salas' />
          <InputLabel onchange={set('numero_de_casas_de_banho')} type='number'
            placeholder='Nº de casas de banho' label='Casas de Banho' />
        </HStack>

        <Text fontSize={12}>O seu imóvel tem outros quartos ou áreas além dos mencionados?</Text>
        <SelectCustomValue
          setChange={(e: any) => setformulario2((p) => ({ ...p, imovel_tem_mais_quartos: e[0] === 'sim' }))}
          items={SIM_NAO} width='100%' borderRadius={0} />

        {formulario2.imovel_tem_mais_quartos && (
          <HStack width={'100%'} alignItems={'flex-end'}>
            <InputLabel onchange={(e: any) => setquartos(e)} type='text'
              placeholder='Nome da área ou quarto' label='Nome da área ou quarto' />
            <InputLabel onchange={(e: any) => setnumeros(e)} type='number'
              placeholder='Número' label='Quantidade' />
            <Button onClick={addquartos} fontSize={12} marginTop={'21px'}>Adicionar</Button>
          </HStack>
        )}

        {/* ✅ Chips for additional rooms */}
        <Box display={'flex'} flexWrap={'wrap'} gap={2} width={'100%'}>
          {formulario2.quartos_adicionais
            .filter((item) => item.numero !== 0)
            .map((item, index) => (
              <Box
                key={index}
                draggable
                onDragOver={() => aparquartosadicionais(item.quarto)}
                onClick={() => aparquartosadicionais(item.quarto)}
                gap={2}
                padding={'5px 12px'}
                borderRadius={50}
                alignItems={'center'}
                borderWidth={1}
                display={'flex'}
                cursor={'pointer'}
                _hover={{ bg: 'red.50', borderColor: 'red.300' }}
                transition={'all 0.15s'}
              >
                <Text color={'gray'} fontSize={10}>{item.quarto}</Text>
                <Text color={'gray'} fontSize={10}>|</Text>
                <Text color={'gray'} fontSize={10}>{item.numero}</Text>
                <Text color={'red.400'} fontSize={10}>✕</Text>
              </Box>
            ))}
        </Box>
      </VStack>

      {/* ── Fotos do imóvel ── */}
      <VStack width={'100%'} gap={2}>
        <Text fontSize={12} color={'gray'} width={'100%'}>Fotos do Imóvel</Text>
        <DropZone
          label='Clique ou arraste as fotos do imóvel aqui'
          inputRef={inputref4}
          onChange={(files) => handleUpload(files, 'fotos_da_propriedade', setPrevImovel)}
        />
        <FilePreviewGrid
          files={prevImovel}
          onDelete={(i) => handleDelete(i, 'fotos_da_propriedade', setPrevImovel)}
        />
      </VStack>

    </VStack>
  )
}
