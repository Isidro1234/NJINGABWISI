'use client'
import { Button, Menu, Portal } from "@chakra-ui/react"
import { useRouter } from "next/navigation"


interface CustomMenuProps {
  icon: React.ReactElement
  menuitems: Array<{label:string, value:string}>
}

const CustomMenu = ({icon, menuitems}:CustomMenuProps) => {
  const router = useRouter()
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button borderRadius={50} gap={0} padding={0} width={'fit-content'} height={'auto'}  bg={'transparent'}>
          {icon}
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {menuitems.map((item:any, index:number)=>(
              <Menu.Item onClick={()=>router.push(item.value)} key={index} value={item.value}>{item.label}</Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
export default CustomMenu