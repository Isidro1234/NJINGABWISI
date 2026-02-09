"use client"

import {
  Avatar,
  HStack,
  Select,
  createListCollection,
  useSelectContext,
} from "@chakra-ui/react"

const SelectValue = () => {
  const select = useSelectContext()
  const items = select?.selectedItems as Array<{ name: string; avatar: string }>
  return (
    <Select.ValueText placeholder="Select member">
      <HStack>
        <Avatar.Root  size="2xs">
         {items?.[0]?.avatar &&
         <Avatar.Image borderRadius={50} src={items?.[0]?.avatar || ''} alt={items?.[0]?.name || ''} />
         }
          <Avatar.Fallback name={items?.[0]?.name || ''} />
        </Avatar.Root>
        {items?.[0]?.name && items?.[0]?.name}
      </HStack>
    </Select.ValueText>
  )
}


const SelectCustom = ({items}:{items:Array<object>}) => {
    const members = 
    createListCollection({items ,
         itemToString:(item:any)=>item?.name, itemToValue: (item:any) => item?.id})
  return (
    <Select.Root
      collection={members}
      size='xs'
      width="85px"
      borderRadius={50}
      defaultValue={["_pt"]}
      positioning={{ sameWidth: true }}
    >
      <Select.HiddenSelect  />
      <Select.Control >
        <Select.Trigger borderRadius={50} background={'white'}>
          <SelectValue />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Select.Positioner>
        <Select.Content >
          {members?.items?.map((item:any) => (
            <Select.Item item={item} key={item.id} justifyContent="flex-start">
              <Avatar.Root  size="2xs">
                <Avatar.Image borderRadius={50} src={item?.avatar} alt={item?.name} />
                <Avatar.Fallback name={item?.name} />
              </Avatar.Root>
              {item?.name}
              <Select.ItemIndicator />
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  )
}


export default SelectCustom