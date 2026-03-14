"use client"

import {
  Avatar,
  HStack,
  Select,
  Text,
  createListCollection,
  useSelectContext,
} from "@chakra-ui/react"

const SelectValue = () => {
  const select = useSelectContext()
  const items = select.selectedItems as Array<{ id: string; name: string; avatar: string }>

  return (
    <Select.ValueText placeholder="Seleccionar membro">
      <HStack>
        <Avatar.Root shape="rounded" size="2xs">
          {/* ✅ Only render image if avatar is a valid non-empty string */}
          {items?.[0]?.avatar ? (
            <Avatar.Image src={items[0].avatar} alt={items[0].name} />
          ) : null}
          <Avatar.Fallback name={items?.[0]?.name || ""} />
        </Avatar.Root>
      <Text fontSize={12} color={'gray'}>{items?.[0]?.name?.slice(0,10) || ""}...</Text>  
      </HStack>
    </Select.ValueText>
  )
}

const SelecWithIcon = ({
  items,
  onChange
}: {
  items: Array<{ id: string; avatar: string; name: string }>
  onChange?: (value: string) => void
}) => {
  return (
    <Select.Root
      collection={createListCollection({ items, itemToValue: (i) => i.id, itemToString: (i) => i.name })}
      size="sm"
      width="100%"
      // ✅ Correct syntax — just pass the id string in an array
      defaultValue={items?.[0]?.id ? [items[0].id] : []}
      positioning={{ sameWidth: true }}
      onValueChange={(e) => onChange?.(e.value[0])}
    >
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger>
          <SelectValue />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Select.Positioner>
        <Select.Content>
          {items.map((item) => (
            <Select.Item item={item} key={item.id} justifyContent="flex-start">
              <Avatar.Root shape="rounded" size="2xs">
                {/* ✅ Same guard in the dropdown list */}
                {item.avatar ? (
                  <Avatar.Image src={item.avatar} alt={item.name} />
                ) : null}
                <Avatar.Fallback name={item.name} />
              </Avatar.Root>
              <Text fontSize={10} color={'gray'}>{item.name}</Text>
              <Select.ItemIndicator />
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  )
}

export default SelecWithIcon