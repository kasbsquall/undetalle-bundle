import { useState } from 'react'

const BASE = import.meta.env.BASE_URL

/**
 * Una flor dentro del arreglo.
 *
 * Si la foto recortada todavia no existe, se dibuja una forma con los colores
 * de esa flor en vez de dejar el hueco o el icono de imagen rota. Asi el
 * prototipo se puede ir enseñando mientras se completa el material.
 */
const RESPALDO: Record<string, { petalo: string; centro: string }> = {
  'rosa-roja':   { petalo: '#C42741', centro: '#8E1B2E' },
  'rosa-rosada': { petalo: '#F09BB4', centro: '#E0708F' },
  lirio:         { petalo: '#FBF7F0', centro: '#E8C56A' },
  girasol:       { petalo: '#F5C133', centro: '#6B4520' },
  tulipan:       { petalo: '#EE7BA0', centro: '#D2517D' },
  gerbera:       { petalo: '#F2764B', centro: '#B8412A' },
  clavel:        { petalo: '#F4A8C0', centro: '#DE7C9C' },
  hortensia:     { petalo: '#C6B4E3', centro: '#9C86C8' },
  eucalipto:     { petalo: '#8FAE93', centro: '#6E8F74' },
  helecho:       { petalo: '#6E9B6B', centro: '#547A52' },
  gypsophila:    { petalo: '#FFFFFF', centro: '#E8E8EC' },
  globo:         { petalo: '#EC5070', centro: '#C93A58' },
  chocolates:    { petalo: '#8A5A3C', centro: '#5E3A24' },
  peluche:       { petalo: '#D8A97C', centro: '#B5854F' },
  'vino-tinto':  { petalo: '#6B1F2E', centro: '#48141F' },
}

export default function Pieza({ id, nombre }: { id: string; nombre: string }) {
  const [falla, setFalla] = useState(false)
  const colores = RESPALDO[id] ?? { petalo: '#EC5070', centro: '#C93A58' }

  if (falla) {
    return (
      <svg viewBox="0 0 60 60" className="w-full h-full" role="img" aria-label={nombre}>
        {[0, 60, 120, 180, 240, 300].map((giro) => (
          <ellipse key={giro} cx="30" cy="17" rx="9.5" ry="14" fill={colores.petalo}
            transform={`rotate(${giro} 30 30)`} />
        ))}
        <circle cx="30" cy="30" r="8" fill={colores.centro} />
      </svg>
    )
  }

  return (
    <img
      src={`${BASE}piezas/${id}.png`}
      alt={nombre}
      onError={() => setFalla(true)}
      className="w-full h-full object-contain drop-shadow-sm"
      draggable={false}
    />
  )
}
