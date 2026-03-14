
"use client"
import CustomCard from '@/components/custom/CustomCard';
import CustomTable from '@/components/custom/CustomTable';
import { useLogicState } from '@/states/useLogicState';
import { Text, VStack } from '@chakra-ui/react';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl';

export default function DocumentoSingle({params}:{params:Promise<{id:string}>}) {

    const t = useTranslations('documentoSingle')

    const getdatas = useLogicState((state:any)=>state.getsingleDocs);
    const query = useSearchParams()
    const tipo = query.get('tipo');

    const [data, setdata] = useState<any>([])

    useEffect(()=>{
      async function paramsget(){
        const {id}:any = await params;
        const res = await getdatas(id, tipo);
        setdata(res || [])
      }
      paramsget()
    }, [])

  const rt = (data[0]?.formulario?.identificacao?.length > 0) 
    ? data[0]?.formulario?.identificacao  
    : Object.values([{
        ...data[0]?.formulario_imovel?.foto_da_identificacao_do_dono_antigo || [],
        ...data[0]?.formulario_imovel?.tenho_alguns_documentos,
        ...data[0]?.formulario_imovel?.fotos_da_propriedade,
        ...data[0]?.formulario_imovel?.documentos_da_lista_de_documentos_completos,
        ...data[0]?.formulario_dono?.fotos_de_identificacao
      }][0])

  return (
    <VStack width={'100%'} flex={1}>
      <CustomCard>

        {rt?.length === 0 && (
          <Text>{t('messages.noDocuments')}</Text>
        )}

        <CustomTable items={rt}/>

      </CustomCard>
    </VStack>
  )
}

