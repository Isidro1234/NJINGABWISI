'use client'
import { VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'

export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 
  return (
    <VStack className='portal' width={'100%'} bg={'#f6f6f6'} height={'100%'}>
      {children}
    </VStack>
  )
}
