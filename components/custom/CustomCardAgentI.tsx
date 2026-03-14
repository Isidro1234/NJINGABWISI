
"use client"
import { Box, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import AvatarCustom from './AvatarCustom'
import { auth } from '@/config/firebse'
import { useTranslations } from 'next-intl'

export default function CustomCardAgentI({
  image,
  name,
  location,
  estado
}:{
  image:string,
  name:string,
  location:string,
  estado:string
}) {

  const t = useTranslations("agentCard")

  const statusColor =
    estado === "enviado"
      ? "#f19408"
      : (estado === "nao_aceite" || estado === "incompleto")
      ? "red"
      : "green"

  return (
    <HStack width={'100%'} alignItems={'center'}>

        <AvatarCustom
          name={auth.currentUser?.displayName || t("user")}
          image={image}
        />

        <VStack flex={1} gap={0} alignItems={'flex-start'}>
            <Heading fontWeight={400} lineHeight={1.2} fontSize={12}>
              {name}
            </Heading>

            <HStack justifyContent={'flex-start'} alignItems={'center'}>
               <Text lineHeight={1.2} color={'gray'} fontSize={10}>
                 {location}
               </Text>
            </HStack>
        </VStack>

        <VStack gap={0}>
            <Heading
              marginTop={3}
              fontWeight={300}
              lineHeight={1.4}
              fontSize={10}
              color={'gray'}
            >
              {t("processStatus")}
            </Heading>

            <Box
              padding={'5px 8px'}
              bg={statusColor}
              borderRadius={20}
            >
                <Text fontWeight={300} color={'white'} fontSize={10}>
                  {t(`status.${estado}`)}
                </Text>
            </Box>
        </VStack>

    </HStack>
  )
}

