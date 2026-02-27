'use client'
import { Button, Menu, Portal, VStack } from "@chakra-ui/react"
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
          <Menu.Content justifyContent={'flex-start'} alignItems={'flex-start'}>
           
            {menuitems.map((item:any, index:number)=>(
              
              <Menu.Item className='navbar-logged-menu-item' padding={2} onClick={()=>router.push(item.value)} key={index} value={item.value}>
                {item.label}
              </Menu.Item>
            ))}
              <VStack className="mobile-menu" alignItems={'flex-start'} width={'100%'} padding={'0px'}>
                            <Menu.Item padding={2} value="dasboard"   className='navbar-logged-menu-item' onClick={()=>router.push('/portal')}>Dashboard</Menu.Item> 
                            <Menu.Item padding={2} value='propriedades'   className='navbar-logged-menu-item'  onClick={()=>{router.push('/portal/propriedades')}}>propriedades</Menu.Item> 
                            <Menu.Item padding={2} value='pagamentos'    className='navbar-logged-menu-item'  onClick={()=>{router.push('/portal/pagamentos')}}>pagamentos</Menu.Item> 
                            <Menu.Item padding={2} value='impostos'    className='navbar-logged-menu-item'  onClick={()=>{router.push('/portal/Impostos')}}>Impostos</Menu.Item> 
                            <Menu.Item padding={2} value='registrar'    className='navbar-logged-menu-item'  onClick={()=>{router.push('/portal/Registrar')}}>Registrar</Menu.Item>
                            <Menu.Item padding={2} value='validaUIP'    className='navbar-logged-menu-item'  onClick={()=>{router.push('/portal/ValidaUIP')}}>Validar UIP</Menu.Item>
                            <Menu.Item padding={2} value='venderPropriedade'    className='navbar-logged-menu-item'  onClick={()=>{router.push('/portal/VenderPropriedade')}}>Vender Propriedade</Menu.Item>
                            <Menu.Item padding={2} value='funcionariosGov'    className='navbar-logged-menu-item'  onClick={()=>{router.push('/portal/FuncionariosGov')}}>Funcionarios Gov</Menu.Item> 
              
              </VStack>
                
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
export default CustomMenu