"use client"

import { Portal, Select, createListCollection } from "@chakra-ui/react"

interface SelectItem {
  value: string
  label: string
}

const SelectCustomValue = ({items , width}:{items:Array<SelectItem> , width:string}) => {
  return (
    <Select.Root collection={createListCollection({items})} marginLeft={3} size="sm" width={width}>
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger borderRadius={50}>
          <Select.ValueText placeholder={items[0]?.value} />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {items.map((item:any) => (
              <Select.Item item={item} key={item.value}>
                {item.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  )
}


export default SelectCustomValue