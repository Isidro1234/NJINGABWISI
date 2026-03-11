'use client'
import { Box, HStack, Input, Text, VStack } from '@chakra-ui/react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import InputLabel from './InputLabel'
import SelectCustomValue from './SelectCustomValue'
import { Country, State } from 'country-state-city'
import { angola, municipos_angola } from '@/logic/countries'
import { store } from '@/logic/storemedia'

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

export default function Form2({ getform2 }: Form2Props) {
  const inputref1 = useRef<HTMLInputElement>(null)
  const inputref2 = useRef<HTMLInputElement>(null)
  const inputref3 = useRef<HTMLInputElement>(null)
  const inputref4 = useRef<HTMLInputElement>(null)

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
    area_total_do_imove:null,
    comprimento_da_propriedade: null,
    largura_da_propriedade: null,
    fotos_da_propriedade: [] as any[],
    tenho_alguns_documentos: [] as any[],
  })

  // Ref prevents getform2 from causing infinite useEffect loop
  const getform2Ref = useRef(getform2)
  useEffect(() => { getform2Ref.current = getform2 }, [getform2])

  // Debounced — notifies parent 300ms after user stops typing
  useEffect(() => {
    const timeout = setTimeout(() => {
      getform2Ref.current(formulario2)
    }, 300)
    return () => clearTimeout(timeout)
  }, [formulario2])

  // Memoized — computed once on mount
  const countries = useMemo(() =>
    Country.getAllCountries().map((c) => ({ value: c.isoCode, label: c.name }))
  , [])

  const isAngola = useMemo(
    () => ANGOLA_CODES.includes(formulario2?.utente_pais || ""),
    [formulario2.utente_pais]
  )

  // Recomputes only when utente_pais changes
  const states = useMemo(() => {
    if (isAngola) return angola
    return State.getStatesOfCountry(formulario2?.utente_pais || "").map((s) => ({
      value: s.isoCode,
      label: s.name
    }))
  }, [formulario2.utente_pais, isAngola])

  // Recomputes only when utente_estado changes
  const municipios = useMemo(() => {
    const found = municipos_angola.find((p) => p?.province === formulario2.utente_estado)
    return found?.municipalities.map((m) => ({ value: m, label: m })) || []
  }, [formulario2.utente_estado])

  // Recomputes only when utente_municipio changes
  // Fixed: was looping all provinces with .map() — now stops at first match with a for loop
  const comunas = useMemo(() => {
    for (const province of municipos_angola) {
      const found = province?.municipio.find((cm) => cm.nome === formulario2.utente_municipio)
      if (found) return found.comunas.map((cm: any) => ({ value: cm, label: cm }))
    }
    return []
  }, [formulario2.utente_municipio])

  const showComunas = comunas.length > 0 && comunas[0]?.value !== ''

  // Derived booleans from formulario2 — replaces the old duplicate state variables
  const isOwner = formulario2.sou_dono_do_imovel === 'sim'
  const isAgent = formulario2.sou_agente_imobiliario === 'sim'
  const hasFullDocs = formulario2.tenho_documento_completo === 'sim'
  const hasDocs = formulario2.tenho_documentos === 'sim'
  const isGovOrInstitutional = ['governamental', 'institucional'].includes(formulario2?.categoria_de_imovel || "")

  // Generic field setter — replaces dozens of repeated inline handlers
  const set = useCallback((field: string) => (e: any) => {
    setformulario2((prev) => ({ ...prev, [field]: e }))
  }, [])

  // Fixed FileReader — wrapped in Promise so it's actually awaited
  const processdocs = useCallback(async (file: File): Promise<any> => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    const storemedia = await store({ image: file, name: file.name, type: file.type })
    return storemedia
  }, [])

  // Fixed: original had `return processdocs` (missing `(item)`) — was storing function refs, not data
  const getdocs = useCallback(async (files: FileList | null, where: string) => {
    if (!files) return
    const result = await Promise.all(Array.from(files).map((item) => processdocs(item)))
    const fieldMap: Record<string, string> = {
      todos: 'documentos_da_lista_de_documentos_completos',
      fotos: 'foto_da_identificacao_do_dono_antigo',
      alguns: 'tenho_alguns_documentos',
      imovel: 'fotos_da_propriedade'
    }
    const field = fieldMap[where]
    if (field) setformulario2((prev) => ({ ...prev, [field]: result }))
  }, [processdocs])

  const clickRef:any = useCallback((ref: React.RefObject<HTMLInputElement>) => {
    ref.current?.click()
  }, [])
  return (
    <VStack width={'100%'} gap={3}>

      {/* Localização */}
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

      {/* Posse */}
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
            <InputLabel placeholder='Digite seu UIP' type='text'
              onchange={set('verificar_uip')} label='Verifique seu UIP' />
          )}
        </VStack>
      )}

      {/* Documentos */}
      <VStack width={'100%'} alignItems={'start'}>
        <Text color={'gray'} fontSize={12}>O senhor tem algum documento que comprova sua posse desse imóvel?</Text>
        <SelectCustomValue setChange={(e: any) => setformulario2((p) => ({ ...p, tenho_documentos: e[0] }))}
          items={SIM_NAO} width='100%' borderRadius={0} />
        {hasDocs && (
          <Box cursor={'pointer'} onClick={() => clickRef(inputref1)}
            display={'flex'} width={'100%'} justifyContent={'center'} padding={10} borderWidth={2} borderStyle={'dashed'}>
            <Input onChange={(e) => getdocs(e.target.files, 'todos')} ref={inputref1} type='file' multiple display={'none'} />
            <Text fontSize={12} color={'gray'}>Enviar documentos</Text>
          </Box>
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
          <Box cursor={'pointer'} display={'flex'} onClick={() => clickRef(inputref2)}
            width={'100%'} justifyContent={'center'} padding={10} borderWidth={2} borderStyle={'dashed'}>
            <Input onChange={(e) => getdocs(e.target.files, 'fotos')} ref={inputref2} type='file' multiple display={'none'} />
            <Text fontSize={12} color={'gray'}>Enviar documentos</Text>
          </Box>
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
            <Box cursor={'pointer'} onClick={() => clickRef(inputref3)}
              display={'flex'} justifyContent={'center'} padding={10} width={'100%'} borderWidth={2} borderStyle={'dashed'}>
              <Input onChange={(e) => getdocs(e.target.files, 'alguns')} ref={inputref3} type='file' multiple display={'none'} />
              <Text fontSize={12} color={'gray'}>Enviar fotos do UIP / Bilhete do dono anterior</Text>
            </Box>
          </VStack>
        </>
      )}

      {/* Categoria e Tipo */}
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

      {/* Dimensões */}
      <Text fontSize={12} color={'gray'}>Dimensão do Imóvel</Text>
      <InputLabel onchange={set('area_total_do_imove')} type='text'
        placeholder='Superfície total em m²' label='Superfície Total (m²)' />
      <InputLabel onchange={set('comprimento_da_propriedade')} type='text'
        placeholder='Comprimento em metros' label='Comprimento (m)' />
      <InputLabel onchange={set('largura_da_propriedade')} type='text'
        placeholder='Largura em metros' label='Largura (m)' />

      {/* Fotos */}
      <VStack width={'100%'}>
        <Text fontSize={12} color={'gray'}>Fotos do Imóvel</Text>
        <Box cursor={'pointer'} onClick={() => clickRef(inputref4)}
          display={'flex'} justifyContent={'center'} width={'100%'} borderStyle={'dashed'} padding={10} borderWidth={2}>
          <Input onChange={(e) => getdocs(e.target.files, 'imovel')} ref={inputref4} type='file' multiple display={'none'} />
          <Text fontSize={12} color={'gray'}>Adicionar fotos</Text>
        </Box>
      </VStack>

    </VStack>
  )
}