"use client"
import { PinInput } from "@chakra-ui/react"


const CustomOTP = ({onchange}:{onchange:Function}) => {
  return (
    <PinInput.Root flexWrap={'wrap'}>
      <PinInput.HiddenInput onChange={(e)=>{onchange(e.target.value)}} />
      <PinInput.Control flexWrap={'wrap'}>
        <PinInput.Input index={0} />
        <PinInput.Input index={1} />
        <PinInput.Input index={2} />
        <PinInput.Input index={3} />
      </PinInput.Control>
    </PinInput.Root>
  )
}
export default CustomOTP