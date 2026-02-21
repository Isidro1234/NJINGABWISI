import { CustomCaroussel } from "@/components/custom/CustomCaroussel";
import { MapaAngola_SVG } from "@/components/custom/MapaAngola";
import Footer from "@/components/structures/Footer";
import { Box, Button, Heading, HStack, Input, Text, VStack } from "@chakra-ui/react";
import Image from "next/image";
import Facebook from '../public/icons/facebook.svg'
import Gmail from '../public/icons/gmail.svg'
import Instagram from '../public/icons/instagram.svg'
import Whatsapp from '../public/icons/whatsapp.svg'

export default function Home() {
  return (
    <VStack width={'100%'} gap={0}>
      <VStack minW={100} minHeight={200} maxHeight={'500px'} gap={0} padding={0} background={'black'} position={'relative'} width={'100%'}>
        <CustomCaroussel items={[{image:'/images/image-3.jpg'}, {image:'/images/image-4.jpg'}]}/>
        <VStack gap={5} justifyContent={'center'} left={0} top={0} height={'100%'} width={'100%'} position={'absolute'}>
          <Box padding={4} alignItems={'center'} gap={0} display={'flex'} flexDirection={'column'}>
            <Heading lineHeight={1.2} minWidth={100} fontSize={28} color={'white'}>Bem-vindo a NJINGA</Heading>
          <Text  marginBottom={4} marginTop={1} width={300} textAlign={'center'} fontSize={15} fontWeight={200} color={'#f6f6f6'}>Plataform Angolana State of the Art, Para registo digital de Propriedades</Text>
          <Button bg={'red'} borderRadius={20}>crie sua conta</Button>
          </Box>
          
        </VStack>
      </VStack>
      
      <VStack marginTop={7} paddingBottom={10}>
        <Heading fontWeight={500} color={'#da3d3d'} padding={'4px 20px'} borderRadius={50} fontSize={10} 
        boxShadow={'1px 1px 2px #d5d5d5'}>Registro & Impostos</Heading>
        <Heading marginTop={4} fontSize={27} textAlign={'center'} maxWidth={300}>Facilitando registro de <span style={{color:'red'}}> imoveis</span> e pagamentos de <span style={{color:'red'}}>Impostos</span></Heading>
        <Text fontSize={12} color={'gray'} textAlign={'center'}>Saiba mais sobre nossos servicos</Text>
        <Box className="main-image-conteiner" >
            <Image className="hero-image" fill={true} alt="image" src={'/images/portal.png'}/>
        </Box>    
      </VStack>
      <VStack width={'100%'} background={'#fafafa'} paddingBottom={10}>
         <Heading marginTop={5}  fontWeight={500} color={'#da3d3d'} padding={'10px 20px'}
        paddingTop={4} lineHeight={1.3} borderRadius={50} fontSize={10} background={'white'} width={200}
        boxShadow={'1px 1px 2px #d5d5d5'} textAlign={'center'}>De Cabinda ao Cunene Registe Seu Imovel</Heading>

        <HStack justifyContent={'center'}   width={'100%'} paddingTop={5}>
        <HStack minW={200} flexWrap={'wrap'} gap={4} width={'100%'} maxWidth={1000} padding={10} alignItems={'flex-start'}>
            <Box minWidth={300} flex={1} paddingTop={5}>
            <Heading  lineHeight={1.2} minW={300} width={'100%'} maxWidth={400} fontSize={45}>
              Registe seu imovel em qualquer provincia de <span style={{color:'red'}}>Angola</span>  </Heading>
            <Text color={'gray'}>
              Com a Njinga podes simplesmente registar seu imovel online,
              enviar todos os documentos em conforme e beneficiar de ter 
              seu imovel em conforme com a lei Angolana
            </Text>
          </Box>
          <Box minWidth={300} flex={1} paddingTop={10}>
            <video src={'/videos/video.mp4'} style={{width:440, objectFit:'cover', height:300, 
              minWidth:200, borderRadius:20}} playsInline  autoPlay loop muted>
            </video>
          </Box>
        </HStack>
        
      </HStack>
      </VStack>
      <VStack justifyContent={'center'} height={'70vh'} bg={'#d33434'} width={'100%'} padding={10}>
        <VStack gap={2} padding={5}>
          <Heading color={'#ffffff'} fontSize={30}>Contacte-nos</Heading>
          <Text  width={220} color={'#f6f6f6'} fontSize={10} textAlign={'center'}>Receba notificacoes sobre novos servicos adicionados a NJINGA</Text>
         
          <Box display={'flex'} bg={'white'} borderRadius={50} padding={2}>
            <Input border={'none'} outline={'none'} placeholder="Insira seu email"/>
            <Button bg={'red'} borderRadius={50}>Enviar</Button>
          </Box>
           <HStack gap={2} marginTop={2}>
            <Button bg={'white'} margin={0} padding={0} width={10} height={10} borderRadius={50}><Facebook width={40} height={40}/></Button>
            <Button bg={'white'} margin={0} padding={0} width={10} height={10} borderRadius={50}><Instagram width={40} height={40}/></Button>
            <Button bg={'white'} margin={0} padding={0} width={10} height={10} borderRadius={50}><Whatsapp width={40} height={40}/></Button>
            <Button bg={'white'} margin={0} padding={0} width={10} height={10} borderRadius={50}><Gmail width={40} height={40}/></Button>
          </HStack>
        </VStack> 
         
      </VStack>
      <Footer/>
    </VStack>
  );
}
