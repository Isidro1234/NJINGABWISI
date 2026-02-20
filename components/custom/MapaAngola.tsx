'use client'
import { useRef } from 'react'
import MapaAngolaSVG  from '../../public/icons/ao.svg'




export function MapaAngola_SVG(){
    const ref1 = useRef<HTMLOrSVGElement>(null)
    console.log(ref1.current)
    return(<div className='mapa-angola'>
        <MapaAngolaSVG  ref={ref1} color={'red'}/>
    </div>)
}