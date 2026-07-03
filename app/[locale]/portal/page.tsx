"use client"
import CustomCard from '@/components/custom/CustomCard'
import { Avatar, Box, Button, Heading, HStack, Input, Spinner, Text, VStack } from '@chakra-ui/react'
import React, { InputHTMLAttributes, useEffect, useRef, useState } from 'react'
import CustomPCard from '@/components/custom/CustomPCard'
import CustomECard from '@/components/custom/CustomECard'
import Image from 'next/image'
import CustomUipCard from '@/components/custom/CustomUipCard'
import CustomGovCard from '@/components/custom/CustomGovCard'
import CustomReCard from '@/components/custom/CustomReCard'
import Folder from "../../../public/icons/folder.svg"
import CustomMeuUIP from '@/components/custom/CustomMeuUIP'
import { useAuthContext } from '@/context/authContext'
import ProfileIcon from "../../../public/icons/profile.svg"
import CheckoutForm from '@/components/custom/CheckoutForm'
import UIPprint from '@/components/custom/UIPprint'
import { printing_pdf } from '@/logic/printpdf'
import { Toaster, toaster } from '@/components/ui/toaster'
import { useLogicState } from '@/states/useLogicState'
import { auth } from '@/config/firebse'
import CustomCardAgentI from '@/components/custom/CustomCardAgentI'
import TransferirUIP from '@/components/custom/TransferirUIP'
import { useTranslations } from 'next-intl'
import DigitalFolder from "../../../public/icons/digitalfolder.svg"
import { useStateAuth } from '@/states/useAuthState'
import SelectCustom from '@/components/custom/SelectCustom'
import SelectCustomValue from '@/components/custom/SelectCustomValue'
import CustomDiaglog from '@/components/custom/CustomDialog'
import { store } from '@/logic/storemedia'
import { api } from '@/logic/auth'


const IconsFile = ({ name, file }: { name: string; file: any }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const ext = name?.split(".").pop()?.toLowerCase();
  const isImage = ["png", "jpg", "jpeg", "webp"].includes(ext ?? "");

  useEffect(() => {
    if (!file || !isImage) return;

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    return () => { reader.abort(); }; // cleanup on unmount
  }, [file]);

  return (
    <VStack _hover={{backgroundColor:"#bde1ff", borderRadius:5, padding:4}} cursor={"pointer"}>
      {isImage && (
        <VStack>
          {preview
            ? <Image height={50} width={50} src={preview} alt={name} />
            : <Spinner size="sm" />   // show loader while reading
          }
          <Text color="gray" fontSize={10}>{name}</Text>
        </VStack>
      )}
      {ext === "pdf"  && <VStack><Image alt='pdf' src={"/icons/pdf.svg"} height={50} width={50}/> <Text fontSize={10}> {name}</Text></VStack>}
      {ext === "docx" && <VStack><Image alt='docs' src={"/icons/word.svg"} height={50} width={50}/><Text fontSize={10}> {name}</Text></VStack>}
      {!isImage && ext !== "pdf" && ext !== "docx" && (
        <VStack><Image alt='docs' src={"/icons/file.svg"} height={50} width={50}/><Text fontSize={10}> {name}</Text></VStack> // fallback for other types
      )}
    </VStack>
  );
};
export default function Portal() {
  const t = useTranslations('portal.index')
  const [casas, setcasas] = useState([])
  const [agente, setagente] = useState<any>([])
  const [pedidos, setPedidos] = useState<any>([])
  const [servicos, setServicos] = useState<any>([])
  const getDfolder = useLogicState((state:any)=>state.get_digital_folder)
  const refpdf = useRef(null)
  const downloaduip = useLogicState((state:any)=>state.download_uip)
  const uip_info = useStateAuth((state:any)=>state.MyUIP)
  const digitalfoder = useLogicState((state:any)=>state.create_digital_folder_profile)
  const [digitalFolderData , setuserdatafolder] = useState([])
  const [isloading, setLoading] = useState(false)
  const [esharePara, setPara] = useState('')
  const [eshareDocs, setEshareDocs] = useState('')
  const eShareDocref = useRef<HTMLInputElement>(null)
  const [eshareSearch, setEshareSearch] = useState<any>({})
  const [isUserDigitalfolderCreated, setuserDigitalCreating] = useState(false)
  const [document_name, setName] = useState("")
  const [eshareSelected, setEshareSelected] = useState<any>(null)
  const [isloading2, setLoad2] = useState(false)
  const getuip = useLogicState((state:any)=>state.queryUserUIP)
  const [document_url, setDocument]  = useState(()=>({
    document:[]
  }))
  const docreft = useRef<HTMLInputElement>(null)
  useEffect(()=>{
    if(!uip_info) return
    async function getting(){
      const datas = await getDfolder(uip_info.data.short_uip)
      console.log(datas , uip_info)
      if(datas?.success){
        setuserDigitalCreating(true)
        setuserdatafolder(datas.data)
      }
      
    }
    getting()
  }, [uip_info])
  async function downloadUIP() {
    setLoading(true)
    const res = await downloaduip()
    if(res){
      setLoading(false)
      return
    }
    setLoading(false)
    return
  }
  async function buscarServicos(){
    try {
        const buscar = await fetch('/api/services');
        const res = await buscar.json();
        const {services} = res;
        return services
    } catch (error) {
        console.log(error)
        return []
    }
     



  }

  async function handleDoc(file: File) {
  const stores =await store({name:file.name , type:file.type , image:file})
  if(!stores) return
  try {
    const res = await api.post ("/api/v1/digitalfolder/uploadDocument", {
  user_uip:uip_info.data.short_uip ,
   document:stores , document_name:file.name , doc_type:file.type
    });
    const data = await res.data
    if (!data.success) throw new Error("Upload failed");
    toaster.create({ title: "Documento enviado", type: "success" });
  } catch (err) {
    toaster.create({ title: "Erro ao enviar documento", type: "error" });
  }
}
  async function createProfile(){
    const res = await digitalfoder(uip_info.data.full_name, uip_info.data.short_uip);
    setuserDigitalCreating(true)
  }
 
  async function getUserDigitalFolderProfile(uip:string){
    setLoad2(true)
      const datas = await getDfolder(uip)
      if(datas?.success){
        uip_to_info(uip)
         setLoad2(false)
         return
      }
       setLoad2(false)
      return
  }

  async function uip_to_info(uip:string){
     const querying = await getuip(uip)
     if(querying.success){
      setEshareSearch(querying.data)
      console.log("got it", querying)
      return
     }
     toaster.create({
      title:"Este UIP nao existe",
      description:"Nao foi possivel encontrar nenhum usuario com este uip",
      type:"error"
     })
     return
     
  }
  console.log("portal", digitalFolderData)
  return (
    <HStack className='portal-conteiner' display={'grid'} 
      gridTemplateColumns={'repeat(auto-fit, minmax(350px,1fr))'}
      alignItems={'flex-start'} width={'100%'} bg={'#f6f6f6'} padding={10}>
        <Box display={pedidos.length > 0 ?  'flex' : 'none'} justifyContent={'center'} alignItems={'center'} left={0} top={0} width={'100%'} height={'full'}
         borderRadius={0} bg={'#4949494b'} position={'fixed'} zIndex={1000}>
             <Box justifyContent={'start'} flexDirection={'column'} display={'flex'} bg={'white'} padding={10} borderRadius={10}>
              <Heading fontSize={14}>Pedidos de Transacao</Heading>
               {pedidos?.map((item:any, index:any)=>{
              return(
                <Box width={'100%'} display={'flex'} flexDirection={'column'} alignItems={'start'} key={index} >
                      <Box width={'100%'} height={200} position={'relative'}>
                        {
                          item?.photohouse &&
                           <Image src={item?.photohouse} alt='photo'/>
                        }
                       
                      </Box>
                      <Text fontSize={12} color={'gray'}>Dono: {item?.current_dono_uip?.nome}</Text>
                      <Text fontSize={12} color={'gray'}>preco: {item?.preco}</Text>
                      <HStack  gap={2}>
                        <Button bg={'#12be5d'} borderRadius={50}>Aceitar</Button>
                        <Button bg={'#d24242'} borderRadius={50}>Negar</Button>
                      </HStack>
                </Box> 
              )
            })}
             </Box>
             
            
            
        </Box>

      {/* ── My Properties ── */}
      <CustomCard link='portal/propriedades' description={t('description')}
        title={t('card_properties_title')}
        icon={<Image src={'/icons/imovel.svg'} alt='imovel' width={30} height={30} />}
        bg={'#E3EAFA'}>
        <VStack alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={2} gap={4}>
          <Text fontSize={12} color={'gray'}>{t('properties_list')}</Text>
          {casas.map((item: any, index: any) => (
            <CustomPCard
              key={index}
              image={item?.formulario_imovel?.fotos_da_propriedade[0]}
              estado={item?.estado}
              location={item?.formulario_imovel?.utente_rua?.slice(0, 21)}
              name={'Imovel ' + item?.formulario_imovel?.utente_distrito?.slice(0, 10)}
            />
          ))}
        </VStack>
      </CustomCard>

        
      {/* ── Agents ── */}
      <CustomCard bg={'#f6f6f6'} link='portal/Agentes' title={t('card_agents_title')}
        description={t('description')}
        icon={<Image src={'/icons/agent-logo.svg'} alt='agente' width={30} height={30} />}>
        {agente.length <= 0 ? (
          <VStack width={'100%'}>
            <Text lineHeight={1.0} width={'100%'} textAlign={'center'} fontSize={12} color={'gray'}>
              {t('apply_agent')}
            </Text>
            <Text lineHeight={1.0} textAlign={'center'} fontSize={12} color={'gray'}>
              {t('apply_agent_sub')}
            </Text>
            <Button bg={'blue'} fontSize={10} borderRadius={50}>
              {t('apply_agent_btn')}
            </Button>
          </VStack>
        ) : (
          <VStack alignItems={'start'} width={'100%'}>
            <Text fontSize={12} color={'gray'}>{t('my_agent_profile')}</Text>
            <CustomCardAgentI
              estado={agente[0]?.estado}
              location={'de ' + agente[0]?.formulario?.provincia}
              name={auth.currentUser?.displayName?.slice(0, 15) || ''}
              image={auth.currentUser?.photoURL || ''}
            />
          </VStack>
        )}
      </CustomCard>

      {/* ── Payments ── */}
      <CustomCard link='portal/pagamentos' description={t('description')}
        title={t('card_payments_title')}
        icon={<Image src={'/icons/coin.svg'} alt='coin' width={50} height={50} />}
        bg={'#f6f6f6'}>
        <VStack alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={2} gap={4}>
          <Text fontSize={12} color={'gray'}>{t('recent_payments')}</Text>
          
        </VStack>
      </CustomCard>

      {/* ── Validate PIU ── */}
      <CustomCard link='portal/ValidaUIP' description={t('description')}
        title={t('card_validate_title')}
        icon={<Image src={'/icons/uip.svg'} alt='uip' width={25} height={25} />}
        bg={'#E3FAF5'}>
        <VStack alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={2} gap={4}>
          <Text fontSize={12} color={'gray'}>{t('validate_piu')}</Text>
          <CustomUipCard />
        </VStack>
      </CustomCard>

      {/* ── Register Property ── */}
      <CustomCard link='portal/Registrar' description={t('description')}
        title={t('card_register_title')}
        icon={<Image src={'/icons/registar.svg'} alt='registar' width={25} height={25} />}
        bg={'#e9daf9'}>
        <VStack alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={5} gap={4}>
          <CustomReCard link='portal/Registrar' />
        </VStack>
      </CustomCard>

      <CheckoutForm />

      {/* ── Gov Employees ── */}
      <CustomCard link='portal/FuncionariosGov' description={t('description')}
        title={t('card_gov_title')}
        icon={<Image src={'/icons/gov.svg'} alt='gov' width={25} height={25} />}
        bg={'#DFFCE7'}>
        <VStack alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={2} gap={4}>
          <Text fontSize={12} color={'gray'}>{t('gov_employees')}</Text>
          <CustomGovCard />
        </VStack>
      </CustomCard>

      {/* ── My UIP ── */}
      <CustomCard link='portal/MeuUIP' description={t('description')}
        title={t('card_uip_title')}
        icon={<Image src={'/icons/stats.svg'} alt='uip' width={25} height={25} />}
        bg={'#ebdffc'}>
        <VStack alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={5} gap={4}>
          <CustomMeuUIP userdata={uip_info?.data} />
          <Box position={'fixed'} top={'-9999px'} left={'-9999px'} zIndex={-1}>
            <UIPprint ref={refpdf} />
          </Box>
          <Button disabled={isloading} bg={'#419f5b'} fontWeight={400} fontSize={10} size={'2xs'}
            onClick={downloadUIP} borderRadius={5}>
              {isloading ? <Spinner size='sm' /> :  t('download_pdf')}
          </Button>
        </VStack>
      </CustomCard>

      {/* ── Transfer UIP ── */}
      <CustomCard link='portal/MeuUIP' description={t('description')}
        title={t('card_transfer_title')}
        icon={<Image src={'/icons/vender.svg'} alt='transferir' width={25} height={25} />}
        bg={'#dffcf8'}>
        <TransferirUIP
          casas={casas?.filter((it: any) => it.estado === 'aprovado') || []}
        />
      </CustomCard>
      <CustomCard  icon={<Image style={{scale:1.5}} src={'/icons/eShare.svg'} alt='transferir' width={95} height={95} />} 
      bg='#dffcf8' title='eShare' link='portal/' description='inta inc'>
        <Text color={'gray'} fontSize={10}>Envie documentos de forma segura</Text>
       <VStack width={"100%"}>
        <HStack width={'100%'} position={'relative'}>
          
          <Box > 
            <Text color={'gray'} fontSize={10}>Documento</Text>
            <Input display={'none'} ref={eShareDocref} type='file'/>
            <CustomDiaglog text='enviar' color='red'
            icon={<Box cursor={'pointer'} alignItems={'center'} display={'flex'} padding={2} paddingLeft={4} borderRadius={10} borderWidth={1}>
                  <Folder color="gray" height="20px" width="20px"/>
                </Box>}
            body={
              <VStack>
                <Box _hover={{borderColor:"red", fill:"red", color:"red"}} justifyContent={'center'}  borderColor={'gray'} borderStyle={'dashed'} height={200} width={'100%'} onClick={()=>{eShareDocref.current?.click()}} gap={2} cursor={'pointer'} alignItems={'center'} display={'flex'} padding={2} paddingLeft={4} borderRadius={10} borderWidth={2}>
                  <Folder color="gray" height="20px" width="20px"/>
                  <Text  color={'gray'}>Subir documentos </Text>
                </Box>
                <Text marginTop={5} textAlign={'start'} width={'100%'} fontSize={15} color={'gray'}>Documentos do seu digital folder</Text>
              </VStack>
              
            }
            title='Adicionar documentos'
            />

            
         </Box>
         <Box flex={1} minW={170}>
          <Text color={'gray'} fontSize={10}>Enviar para </Text>
          <Box >
            <SelectCustomValue
                items={[{value:"governo" , label:"governo"} , 
                  {value:"cidadao", label:"cidadao"}
                ]}
                width='100%'
                setChange={(e:any)=>{setPara(e)}}
                borderRadius={10}
                />
          </Box>
          
          
         </Box>
         <Box position={'relative'} display={esharePara == "cidadao" ? "block" : "none"}>
          <Text color={'gray'} fontSize={10}> UIP do cidadao </Text>
          <Input onChange={(e)=>{getUserDigitalFolderProfile(e.target.value)}} placeholder='UIP' borderRadius={10}/>
           {isloading2 && <Spinner color={'red'} size={'xs'}/>}
        
         </Box>
          <Box  onClick={()=>{setEshareSelected(eshareSearch)}} cursor={'pointer'} display={(eshareSearch.full_name || eshareSelected?.photo)? "flex" : "none"} width={"100%"} borderWidth={1.5} borderRadius={10} zIndex={100} background={'white'}  padding={4} left={0} bottom={-70} position={'absolute'}>
                  <Box  gap={2} alignItems={'center'} display={'flex'}>
                    <Avatar.Root size={"2xs"}>
                      <Avatar.Fallback name={eshareSearch?.full_name}/>
                      <Avatar.Image src={eshareSearch?.photo}/>
                    </Avatar.Root>
                    <Text fontSize={12} color={'gray'}>{eshareSearch?.full_name}</Text>
                  </Box>
         </Box>
         <Box display={eshareSelected?.photo ? "flex" : "none"} gap={2} alignItems={'center'} display={'flex'}>
                    <Avatar.Root size={"2xs"}>
                      <Avatar.Fallback name={eshareSearch?.full_name}/>
                      <Avatar.Image src={eshareSearch?.photo}/>
                    </Avatar.Root>
                    <Text fontSize={12} color={'gray'}>{eshareSearch?.full_name}</Text>
                  </Box>
        </HStack>
         <Button backgroundColor={"#f53131"} fontSize={12} borderRadius={5} width={'100%'}>eShare</Button>
       </VStack>
      </CustomCard>
      <CustomCard  icon={<DigitalFolder color={"#2471e4"} width={30} height={30} />} 
      bg='#cbddf7' title='Digital Folder' link='portal/' description='inta inc'>
        <Text color={'gray'} fontSize={10}>Crie seu digital folder</Text>
       <VStack justifyContent={'flex-start'} width={'100%'} display={!isUserDigitalfolderCreated ? "flex" : "none"}>
  <Button display={isUserDigitalfolderCreated ?  'none' : 'block'} onClick={createProfile} fontSize={12} backgroundColor={"#2471e4"}>
    Activar digital folder
  </Button>
</VStack>
        <HStack display={isUserDigitalfolderCreated ? "flex" : "none"} borderBottomWidth={1} paddingBottom={2} width={'100%'} gap={4} alignItems={"center"}>
               <Box _hover={{borderColor:"#4085ed"}} gap={0}   justifyContent={"center"}  alignItems={"center"} display={'flex'} borderRadius={50} borderWidth={1} padding={0} height={8}>
                <Image style={{marginLeft:10}} alt='pesquisa' height={15} width={15} src={'/icons/search.svg'}/>
                <Input marginLeft={-2} height={8} outline={'none'} border={"none"}  borderRadius={50} fontSize={10} placeholder='pesquisa'/>
                </Box>
              <VStack display={isUserDigitalfolderCreated ? "flex" : "none"}>
               
                <Box _hover={{borderColor:"#4085ed"}}  justifyContent={"center"} maxWidth={120} alignItems={"center"} display={'flex'} borderRadius={50} borderWidth={1} padding={0} height={8}>

                <Input textAlign={"center"} height={8} outline={'none'} border={"none"}  borderRadius={50} fontSize={12} placeholder='titulo'/>
                </Box>
              </VStack>
              <VStack flex={1} display={isUserDigitalfolderCreated ? "flex" : "none"}>
  <Box
    onClick={() => docreft?.current?.click()}
    _hover={{ borderColor: "#4085ed" }}
    cursor="pointer"
    alignItems="center"
    gap={2}
    paddingRight={5}
    paddingLeft={5}
    display="flex"
    borderWidth={1}
    borderRadius={50}
  >
    <Heading fontSize={17} color="gray">+</Heading>
    <Text color="gray" fontSize={10}>Documentos</Text>
  </Box>
  <Input
    onChange={(e: any) => {
  const file = e.target.files[0];
  if (!file) return;
  setDocument((prev: any) => ({ ...prev, document: [...prev.document, file] }));
  handleDoc(file); 
}}
    ref={docreft}
    display="none"
    type="file"
  />
</VStack>
              
        </HStack>
        
        <VStack display={isUserDigitalfolderCreated ? "grid" : "none"}  justifyItems={"start"} width={"100%"}  gridTemplateColumns={"repeat(auto-fit, minmax(50px,1fr))"}>
          {document_url?.document?.length > 0 ?
          document_url?.document?.map((t:{name:string, size:number}, index)=>{
            return (
              <IconsFile key={index}  name={t?.name} file={t}/>
            )
          })
          
          : 
 
        <Text  color={'gray'} fontSize={10}>nenhum documento encontrado</Text>
        }
          
        </VStack>
      </CustomCard>
      <Toaster />
    </HStack>
  )
}