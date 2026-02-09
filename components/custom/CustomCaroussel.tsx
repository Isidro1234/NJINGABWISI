'use client'
import { Carousel, HStack, IconButton, Box } from "@chakra-ui/react"
import Image from "next/image"
import {
  LuChevronLeft,
  LuChevronRight,
  LuClock,
  LuPause,
  LuPlay,
} from "react-icons/lu"

type customCarousselType<T> = {
    items : Array<object> | null
}
export function CustomCaroussel<T>({items}:customCarousselType<T>) {
  return (
    <Carousel.Root
      autoplay={true}
      slideCount={items?.length || 0}
      mx="auto"
      width={'100%'}
    >
      <Carousel.ItemGroup>
        {items?.map((item:any, index:any) => (
          <Carousel.Item key={index} index={index}>
            <Box position={'relative'} w="100%" h="500px" background={'#181818'}>
              <Image style={{objectFit:'cover', objectPosition:'center', opacity:.7}} fill src={item?.image} alt={index}/>
            </Box>
          </Carousel.Item>
        ))}
      </Carousel.ItemGroup>

      <Carousel.Control justifyContent="center" gap="4">
        
      </Carousel.Control>
    </Carousel.Root>
  )
}