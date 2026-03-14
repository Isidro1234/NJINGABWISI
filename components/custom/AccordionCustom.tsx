
'use client'
import { Accordion, Text, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useTranslations } from 'next-intl'

export default function AccordionCustom({ children, title }: { children: React.ReactElement, title?: string }) {

    const t = useTranslations('accordion')

    const [isOpen, setIsOpen] = useState<string[]>([])

    return (
        <VStack width={'100%'}>
            <Accordion.Root
                value={isOpen}
                onValueChange={(e: any) => setIsOpen(e.value)}
                width={'100%'}
                collapsible
            >
                <Accordion.Item value={'item'}>
                    <Accordion.ItemTrigger>
                        <Text fontSize={12} color={'gray'}>
                            {title || t('defaultTitle')}
                        </Text>
                        <Accordion.ItemIndicator />
                    </Accordion.ItemTrigger>

                    <Accordion.ItemContent>
                        <Accordion.ItemBody>
                            {children}
                        </Accordion.ItemBody>
                    </Accordion.ItemContent>

                </Accordion.Item>
            </Accordion.Root>
        </VStack>
    )
}

