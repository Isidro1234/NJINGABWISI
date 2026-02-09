'use client'
import { Carousel, HStack, IconButton, Box } from "@chakra-ui/react"
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
        {items?.map((_, index) => (
          <Carousel.Item key={index} index={index}>
            <Box w="100%" h="500px" background={'#f6f6f6'}>
              {index + 1}
            </Box>
          </Carousel.Item>
        ))}
      </Carousel.ItemGroup>

      <Carousel.Control justifyContent="center" gap="4">
        
      </Carousel.Control>
    </Carousel.Root>
  )
}