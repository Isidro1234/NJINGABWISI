"use client"
import { Box, Button, Table, Text, VStack } from "@chakra-ui/react"
import Image from "next/image"


const CustomTable = ({items}:{items:Array<any>}) => {
    function open(url:any){
        console.log(url)
        const element = document.createElement('a');
        element.href = url;
        element.download = "Njinga"

        document.body.appendChild(element);
        element.click()

        document.body.removeChild(element)
    }
  return (
    <Table.Root size="sm">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Documentos</Table.ColumnHeader>
          <Table.ColumnHeader textAlign="end">Operacao</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {items?.map((item:any,index:any)=>{
            return(
        <Table.Row key={index}>
                    <Table.Cell>
                        <VStack>
                        <Box width={10} height={10} position={'relative'}>
                            <Image fill src={'/icons/file.svg'} alt="foto"/>
                        </Box>
                       <Text color={'gray'} fontSize={12}>{item?.split('/')[item?.split('/').length - 1]}</Text> 
                        </VStack>
                    </Table.Cell>
                    <Table.Cell><Button bg={'blue'} onClick={()=>{open(item)}}>Ver documento</Button></Table.Cell>
                </Table.Row>
        )})
        }
      </Table.Body>
    </Table.Root>
  )
}

export default CustomTable
