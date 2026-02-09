import { CustomCaroussel } from "@/components/custom/CustomCaroussel";
import { Box, Button, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import Image from "next/image";

export default function Home() {
  return (
    <VStack width={'100%'}>
      <CustomCaroussel items={[{number:1}, {number:2}]}/>
      <VStack>
        <Heading fontWeight={500} color={'#151515'} padding={'4px 20px'} borderRadius={50} fontSize={10} 
        boxShadow={'1px 1px 2px #d5d5d5'}>Registro & Impostos</Heading>
        <Heading fontSize={27} textAlign={'center'} maxWidth={300}>Facilitando registro de imoveis e pagamentos de Impostos</Heading>
        <Text fontSize={12} color={'gray'} textAlign={'center'}>Saiba mais sobre nossos servicos</Text>
        <Box className="main-image-conteiner" >
            <Image className="hero-image" fill alt="image" src={'/images/portal.png'}/>
        </Box>    
      </VStack>
      <VStack>
         <Heading marginTop={5} fontWeight={500} color={'#151515'} padding={'4px 20px'} borderRadius={50} fontSize={10} 
        boxShadow={'1px 1px 2px #d5d5d5'}>De Cabinda ao Cunene Registe Seu Imovel</Heading>

        
      </VStack>
    </VStack>
  );
}
