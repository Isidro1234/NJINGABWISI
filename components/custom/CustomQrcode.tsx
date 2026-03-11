import { QrCode } from "@chakra-ui/react"


export default function CustomQrcode({value, size}:{value:string, size:number | null}) {
  return (  
    <QrCode.Root value={value} width={'100%'} height={'100%'}>
    <QrCode.Frame width={size || 70} height={size || 70}>
        <QrCode.Pattern />
    </QrCode.Frame>
    </QrCode.Root>
)
}