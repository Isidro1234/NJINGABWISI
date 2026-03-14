import { Box, Input, Text } from "@chakra-ui/react"
import Image from "next/image"
import { useState } from "react"


export default function DropZone({
  label,
  inputRef,
  onChange,
  multiple = true
}: {
  label: string
  inputRef: React.RefObject<HTMLInputElement | null>
  onChange: (files: FileList | null) => void
  multiple?: boolean
}) {
  const [dragging, setDragging] = useState(false)

  return (
    <Box
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        onChange(e.dataTransfer.files)
      }}
      cursor={'pointer'}
      width={'100%'}
      borderWidth={2}
      borderStyle={'dashed'}
      borderColor={dragging ? 'blue.400' : 'gray.300'}
      borderRadius={12}
      padding={6}
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
      transition={'all 0.2s'}
      bg={dragging ? 'blue.50' : 'transparent'}
      _hover={{ borderColor: 'blue.400', bg: 'blue.50' }}
    >
      <Input
        ref={inputRef}
        type='file'
        display={'none'}
        multiple={multiple}
        accept='image/*,.pdf'
        onClick={(e) => { (e.target as HTMLInputElement).value = '' }}  
        onChange={(e) => onChange(e.target.files)}
      />
      <Box position={'relative'} width={6} height={8}>
        <Image src={'/icons/file.svg'} fill alt='upload' />
      </Box>
      <Text fontSize={12} color={'gray'} textAlign={'center'}>{label}</Text>
      <Text fontSize={10} color={'gray.400'}>JPG, PNG, PDF</Text>
    </Box>
  )
}