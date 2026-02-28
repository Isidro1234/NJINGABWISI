"use client"

import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react"
import { Html5QrcodeScanner } from "html5-qrcode"

const CustomQrCodeScanner = ({ icon , onresult}: { icon: any, onresult: Function }) => {
  const [open, setOpen] = useState(false)
  const readerRef = useRef<HTMLDivElement>(null)
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)

  useEffect(() => {
  if (!open) {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(() => {})
      scannerRef.current = null
    }
    return
  }

  const timeout = setTimeout(() => {
    if (readerRef.current && !scannerRef.current) {
      const scanner = new Html5QrcodeScanner(
        readerRef.current.id, // ← use actual DOM id
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        false
      )

      scanner.render(success, error)
      function success(result: any) {
        onresult(result)
        scanner.clear()
        scannerRef.current = null
        setOpen(false)
      }
      function error(err: any) {
        console.warn("QR Error:", err)
      }

      scannerRef.current = scanner
    }
  }, 200)

  return () => {
    clearTimeout(timeout)
    if (scannerRef.current) {
      scannerRef.current.clear().catch(() => {})
      scannerRef.current = null
    }
  }
}, [open])

  return (
    <Dialog.Root lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Dialog.Trigger asChild>
        <Button bg={'transparent'} padding={0} width={'fit-content'} height={'auto'}>{icon}</Button>
      </Dialog.Trigger>

      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Leitor de QR Code</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <div
                id="render"
                ref={readerRef}
                style={{ width: "100%", height: "300px" }}
              />
            </Dialog.Body>

            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
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

export default CustomQrCodeScanner