import { CustomCaroussel } from "@/components/custom/CustomCaroussel"
import Footer from "@/components/structures/Footer"
import { Box, Button, Heading, HStack, Input, Text, VStack } from "@chakra-ui/react"
import Image from "next/image"
import Link from "next/link"
import Facebook from '../../public/icons/facebook.svg'
import Whatsapp from '../../public/icons/whatsapp.svg'
import Instagram from '../../public/icons/instagram.svg'
import Email from '../../public/icons/gmail.svg'
import { getTranslations } from "next-intl/server"

export default async function Home() {
  const t = await getTranslations("home")

  return (
    <VStack width="100%" _dark={{background:'#16171b'}} gap={0}>

      {/* Hero */}
      <VStack
        minW={100}
        minHeight={200}
        maxHeight="500px"
        gap={0}
        padding={0}
        background="black"
        position="relative"
        width="100%"
      >
        <CustomCaroussel
          width="500px"
          items={[
            { image: "/images/image-3.jpg" },
            { image: "/images/image-4.jpg" }
          ]}
        />

        <VStack
          gap={5}
          justifyContent="center"
          left={0}
          top={0}
          height="100%"
          width="100%"
          position="absolute"
        >
          <Box
            padding={4}
            alignItems="center"
            gap={0}
            display="flex"
            flexDirection="column"
          >
            <Heading lineHeight={1.2} minWidth={100} fontSize={28} color="white">
              {t("hero_title")}
            </Heading>

            <Text
              marginBottom={4}
              marginTop={1}
              width={300}
              textAlign="center"
              fontSize={15}
              fontWeight={200}
              color="#f6f6f6"
            >
              {t("hero_subtitle")}
            </Text>

            <Link href="/auth/criarconta">
              <Button bg="red" borderRadius={20} _dark={{color:'white'}}>
                {t("hero_cta")}
              </Button>
            </Link>
          </Box>
        </VStack>
      </VStack>

      {/* Section 1 */}
      <VStack marginTop={7}  paddingBottom={10}>
        <Heading
          fontWeight={500}
          color="#da3d3d"
          padding="4px 20px"
          borderRadius={50}
          fontSize={10}
          boxShadow="1px 1px 2px #d5d5d5"
          _dark={{boxShadow:"0px 0px 0px transparent", background:'#333333', color:"white"}}
        >
          {t("section1_badge")}
        </Heading>

        <Heading marginTop={4} fontSize={27} textAlign="center" maxWidth={300}>
          {t("section1_title_1")}{" "}
          <span style={{ color: "red" }}>
            {t("section1_title_property")}
          </span>{" "}
          {t("section1_title_2")}{" "}
          <span style={{ color: "red" }}>
            {t("section1_title_tax")}
          </span>{" "}
          {t("section1_title_3")}
        </Heading>

        <Text fontSize={12} color="gray" textAlign="center">
          {t("section1_subtitle")}
        </Text>

        <Box className="main-image-conteiner">
          <Image
            className="hero-image"
            fill
            alt="portal"
            src="/images/portal.png"
          />
        </Box>
      </VStack>

      {/* Section 2 */}
      <VStack width="100%" _dark={{background:'#0f1013'}} background="#fafafa" paddingBottom={10}>
        <Heading
          marginTop={5}
          fontWeight={500}
          color="#da3d3d"
          padding="10px 20px"
          paddingTop={4}
          lineHeight={1.3}
          borderRadius={50}
          fontSize={10}
          background="white"
          width={200}
          boxShadow="1px 1px 2px #d5d5d5"
          _dark={{boxShadow:"0px 0px 0px transparent", background:'#333333', color:"white"}}
          textAlign="center"
        >
          {t("section2_badge")}
        </Heading>

        <HStack justifyContent="center" width="100%" paddingTop={5}>
          <HStack
            minW={200}
            flexWrap="wrap"
            gap={4}
            width="100%"
            maxWidth={1000}
            padding={10}
            alignItems="flex-start"
          >
            <Box minWidth={300} flex={1} paddingTop={5}>
              <Heading
                lineHeight={1.2}
                minW={300}
                width="100%"
                maxWidth={400}
                fontSize={45}
              >
                {t("section2_title_1")}{" "}
                <span style={{ color: "red" }}>
                  {t("section2_title_angola")}
                </span>
              </Heading>

              <Text color="gray">
                {t("section2_body")}
              </Text>
            </Box>

            <Box minWidth={300} flex={1} paddingTop={10}>
              <video
                src="/videos/video.mp4"
                style={{
                  width: 440,
                  objectFit: "cover",
                  height: 300,
                  minWidth: 200,
                  borderRadius: 20
                }}
                playsInline
                autoPlay
                loop
                muted
              />
            </Box>
          </HStack>
        </HStack>
      </VStack>

      {/* Contact */}
      <VStack
        justifyContent="center"
        height="70vh"
        bg="#d33434"
        width="100%"
        padding={10}
        _dark={{background:'#0f1012'}}
      >
        <VStack gap={2} padding={5}>

          <Heading _dark={{color:'#8f8f8f'}} color="#ffffff" fontSize={30}>
            {t("contact_title")}
          </Heading>

          <Text _dark={{color:'#565656'}} width={220} color="#f6f6f6" fontSize={10} textAlign="center">
            {t("contact_subtitle")}
          </Text>

          <Box _dark={{backgroundColor:'#2a2a2a', color:'#8f8f8f'}} display="flex" bg="white" borderRadius={50} padding={2}>
            <Input
            _dark={{background:"transparent", color:'#8f8f8f'}}
              border="none"
              outline="none"
              placeholder={t("contact_placeholder")}
            />

            <Button _dark={{backgroundColor:'#383838', color:'#8f8f8f'}} bg="red" borderRadius={50}>
              {t("contact_submit")}
            </Button>
          </Box>

          {/* Social Icons */}
          <HStack gap={2} marginTop={2}>

            <Button _dark={{background:'#242424'}} position={'relative'} bg="white" w={10} h={10} borderRadius={50}>
              <Facebook width={40} height={40}/>
            </Button>

             <Button _dark={{background:'#242424'}} position={'relative'} bg="white" w={10} h={10} borderRadius={50}>
              <Instagram/>
            </Button>
             <Button _dark={{background:'#242424'}} position={'relative'} bg="white" w={10} h={10} borderRadius={50}>
              <Whatsapp/>
            </Button>
            <Button _dark={{background:'#242424'}} position={'relative'} bg="white" w={10} h={10} borderRadius={50}>
              <Email/>
            </Button>

          </HStack>

        </VStack>
      </VStack>

      <Footer />

    </VStack>
  )
}

