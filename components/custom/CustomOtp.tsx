"use client"
import { PinInput } from "@chakra-ui/react"


const CustomOTP = ({onchange}:{onchange:Function}) => {
  return (
    <PinInput.Root type="alphanumeric" flexWrap={'wrap'}>
      <PinInput.HiddenInput  onChange={(e)=>{onchange(e.target.value)}} />
      <PinInput.Control  flexWrap={'wrap'}>
        <PinInput.Input  index={0} />
        <PinInput.Input index={1} />
        <PinInput.Input index={2} />
        <PinInput.Input index={3} />
        <PinInput.Input index={4} />
        <PinInput.Input index={5} />
        <PinInput.Input index={6} />
        <PinInput.Input index={7} />
        <PinInput.Input index={8} />
      </PinInput.Control>
    </PinInput.Root>
  )
}
export default CustomOTP