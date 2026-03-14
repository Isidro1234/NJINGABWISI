"use client"
import InputLabel from '@/components/custom/InputLabel'
import { auth, db } from '@/config/firebse'
import { store } from '@/logic/storemedia'
import { useStateAuth } from '@/states/useAuthState'
import { Box, Button, Input, Text, VStack } from '@chakra-ui/react'
import { updateProfile } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React, { useRef } from 'react'

export default function Perfil() {
  const t = useTranslations('portal.perfil')
  const sair = useStateAuth((state: any) => state.logout)
  const inputref = useRef<HTMLInputElement>(null)
  const [imagepreview, setImagepreview] = React.useState<string | null>(null)

  async function handlePic(fileinput: File) {
    const file = fileinput
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = (e: any) => {
      setImagepreview(e?.target?.result)
    }
    reader.readAsDataURL(file)

    const stored = await store({ image: file, name: file.name, type: file.type })
    if (stored) {
      try {
        await updateProfile(auth.currentUser!, { photoURL: stored })
        const docref = doc(db, 'Perfil', auth.currentUser!.uid)
        await updateDoc(docref, { userPhoto: stored })
      } catch (error: any) {
        console.log(t('errors.image_update_failed'), error)
      }
    } else {
      console.log(t('errors.image_store_failed'))
    }
  }

  function handleclick() {
    inputref?.current?.click()
  }

  return (
    <VStack padding={10} width={'100%'} height={'100%'} bg={'#f6f6f6'}>
      <VStack alignItems={'flex-start'} bg={'white'} padding={10} borderRadius={20}>

        {/* ── Avatar ── */}
        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'100%'}>
          <Box position={'relative'} borderRadius={50} width={75} height={75} bg={'#f6f6f6'}>
            <Image
              fill
              style={{ borderRadius: 50, objectFit: 'cover', height: '100%', width: '100%' }}
              alt='avatar'
              src={imagepreview || auth.currentUser?.photoURL || '/icons/avatar.svg'}
            />
            <Input
              onChange={(e: any) => handlePic(e.target.files[0])}
              ref={inputref}
              type='file'
              display={'none'}
              accept='image/*'
            />
            <Box
              cursor={'pointer'}
              onClick={handleclick}
              position={'absolute'}
              bottom={0} right={0}
              width={25} height={25}
              borderRadius={50}
              bg={'#ffffff'}
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
            >
              <Image alt='edit' src={'/icons/camera.svg'} width={20} height={20} />
            </Box>
          </Box>
          <Text fontSize={12} color={'gray'}>@{auth.currentUser?.displayName}</Text>
        </Box>

        {/* ── Profession ── */}
        <InputLabel
          label={t('profession_label')}
          type='text'
          onchange={(e: any) => console.log(e)}
          placeholder={t('profession_placeholder')}
        />

        {/* ── Agent apply ── */}
        <VStack alignItems={'flex-start'}>
          <Text fontSize={12} color={'gray'}>{t('agent_question')}</Text>
          <Button borderRadius={50} borderWidth={1} borderColor={'#eaeaea'}
            bg={'transparent'} fontWeight={400} color='gray' onClick={sair}>
            {t('apply')}
          </Button>
        </VStack>

        {/* ── Logout ── */}
        <Button borderRadius={50} borderWidth={1} borderColor={'#eaeaea'}
          bg={'transparent'} color='red' onClick={sair}>
          {t('logout')}
        </Button>

      </VStack>
    </VStack>
  )
}