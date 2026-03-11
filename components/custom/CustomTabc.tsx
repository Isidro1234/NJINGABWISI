import { Tabs } from "@chakra-ui/react"
import { useRef } from "react"


const TabsCustom = ({form1, form2, preview , buttonref, change}:{form1:React.ReactElement,
    form2:React.ReactElement,preview:React.ReactElement, buttonref:any , change:Function}) => {

    return (
    <Tabs.Root onValueChange={(e)=>change(e.value)}
      defaultValue="0"
      variant="plain"
      css={{
        "--tabs-indicator-bg": "colors.gray.subtle",
        "--tabs-indicator-shadow": "shadows.xs",
        "--tabs-trigger-radius": "radii.full",
      }}
    >
      <Tabs.List ref={buttonref} width={'100%'} display={'flex'} justifyContent={'center'}>
        <Tabs.Trigger  value="0">1</Tabs.Trigger>
        <Tabs.Trigger value="1">2</Tabs.Trigger>
        <Tabs.Trigger value="2">3</Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Content value="0">
        {form1}
      </Tabs.Content>
      <Tabs.Content value="1">
        {form2}
      </Tabs.Content>
      <Tabs.Content value="2">
        {preview}
      </Tabs.Content>
    </Tabs.Root>
  )
}
export default TabsCustom