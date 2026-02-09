'use client'
import { Button, CloseButton, Drawer, Portal } from "@chakra-ui/react"
import React, { useRef } from "react"


type CustomDrawerType<T> = {
    icon: React.ReactNode | null,
    content : React.ReactNode | null,
    title:string | null
}

export function CustomDrawer<T> ({icon, content,title}:CustomDrawerType<T>) {
    const ref = useRef<any>(null)
    function autoclose(){
        ref.current.click()
    }
  return (
    <Drawer.Root >
      <Drawer.Trigger asChild>
        <Button className="drawer-menu">
          {icon}
        </Button>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>{title}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body onClick={autoclose}>
              {content}
            </Drawer.Body>
            <Drawer.CloseTrigger   asChild>
              <CloseButton ref={ref} size="sm" display={'none'}/>
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  )
}