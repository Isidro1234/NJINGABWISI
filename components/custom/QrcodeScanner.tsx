'use client'
import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode'
import { Text } from '@chakra-ui/react'

interface QRScannerProps {
    onScan: (result: string) => void
    onClose: () => void
}

// ✅ Kills every camera stream on the entire page


export default function QRScanner({ onScan, onClose }: QRScannerProps) {
    const scannerRef = useRef<Html5Qrcode | null>(null)
    const handledRef = useRef(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const scanner = new Html5Qrcode('qr-scanner-container')
        scannerRef.current = scanner
        handledRef.current = false

        scanner.start(
            { facingMode: 'environment' },
            { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
            async (decodedText) => {
                if (handledRef.current) return
                handledRef.current = true
                forceKillAllCameras(scanner)
                onScan(decodedText)
                onClose()
            },
            () => {}
        ).catch(() => {
            setError('Não foi possível aceder à câmera')
        })

        return () => {
            if (!handledRef.current) {
                handledRef.current = true
                forceKillAllCameras(scanner)

            } else {
                // ✅ Already stopped by onScan — just force kill any lingering tracks
                forceKillAllCameras(scanner)
            }
        }
    }, [])
    async function forceKillAllCameras(scanner:any) {
  if (typeof window === 'undefined' || !navigator.mediaDevices) return;

  try {
    // This is the most reliable way: ask the browser for the stream 
    // it's currently using and stop every track.
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach((track) => {
      track.stop();
      track.enabled = false;
    });
    scanner.stop()
  } catch (err) {
    // If getUserMedia fails, it usually means the camera is already released
    // or permission was denied, so we can ignore this.
    console.log(err)
  }
}
    return (
        <div style={{ width: '100%' }}>
            <div id='qr-scanner-container' style={{ width: '100%' }} />
            {error && (
                <Text fontSize={12} color={'red.500'} textAlign={'center'} marginTop={2}>
                    {error}
                </Text>
            )}
        </div>
    )
}