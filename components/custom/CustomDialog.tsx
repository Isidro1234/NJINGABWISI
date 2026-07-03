import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react"
import React from "react"


const CustomDiaglog = ({icon , title, body, color , text}:{icon:React.ReactNode ,
    color:string, text:string, title:string,
    body:React.ReactNode
}) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        {icon}
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              {body}
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button background={color}>{text}</Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}


export default CustomDiaglog