import { QrCode } from "@chakra-ui/react"


export default function CustomQrcode({value}:{value:string}) {
  return (  
    <QrCode.Root value={value} width={'100%'} height={'100%'}>
    <QrCode.Frame width={70} height={70}>
        <QrCode.Pattern />
    </QrCode.Frame>
    </QrCode.Root>
)
}