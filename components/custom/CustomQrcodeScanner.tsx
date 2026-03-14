"use client"
import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react"
import { useState } from "react"
import QRScanner from "./QrcodeScanner"

const CustomQrCodeScanner = ({ icon, onresult }: { icon: any, onresult: Function }) => {
    const [open, setOpen] = useState(false)

    // ✅ Directly kills all video tracks on the page
   

    function handleScan(result: string) {
        onresult(result)
        setOpen(false)
    }

    function handleClose() {
        setOpen(false)
    }

    return (
        <Dialog.Root
            lazyMount
            open={open}
            // ✅ intercept ALL ways the dialog can close
            onOpenChange={(e) => {
                if (!e.open) handleClose()
                else setOpen(true)
            }}
        >
            <Dialog.Trigger asChild>
                <Button bg={'transparent'} padding={0} width={'fit-content'} height={'auto'}>
                    {icon}
                </Button>
            </Dialog.Trigger>

            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Leitor de QR Code</Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            {open && (
                                <QRScanner
                                    onScan={handleScan}
                                    onClose={handleClose}
                                />
                            )}
                        </Dialog.Body>

                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline" onClick={handleClose}>
                                    Cancelar
                                </Button>
                            </Dialog.ActionTrigger>
                        </Dialog.Footer>

                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" onClick={handleClose}/>
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}

export default CustomQrCodeScanner