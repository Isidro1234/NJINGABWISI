"use client"
import { useLogicState } from '@/states/useLogicState';
import React, { useEffect, useState } from 'react'

export default  function Qrcode({params}:{params:Promise<{qrcode:string}>}) {
    const getqrcodedata = useLogicState((state:any)=>state.getUIPprofile)
    const [qrcodedata, setQrcodedata] = useState<Array<any>| null>(null);
    useEffect(()=>{
        async function fetchData(){
            const {qrcode} = await params;
            const data = await getqrcodedata(qrcode)   
            setQrcodedata(data)
        }
        fetchData()
    }, [qrcodedata])
  return (
    <div>
      <h1>Verifying UIP: {qrcodedata?.[0]?.id || "Not Found"}</h1>
    </div>
  )
}
