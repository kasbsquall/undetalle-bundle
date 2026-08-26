import { FORMATOS, CINTAS } from '../datos/catalogo'

/**
 * El recipiente donde cae el arreglo, dibujado en SVG.
 *
 * Va en vectores y no en foto por una razon practica: el color de la cinta lo
 * elige el cliente, y con una foto haria falta una imagen por cada combinacion
 * de formato y color. Asi es un solo valor que cambia.
 */
export default function Recipiente({ formatoId, cintaId }: { formatoId: string; cintaId: string }) {
  const formato = FORMATOS.find((f) => f.id === formatoId) ?? FORMATOS[0]
  const cinta = CINTAS.find((c) => c.id === cintaId) ?? CINTAS[0]

  if (formato.id === 'florero') {
    return (
      <svg viewBox="0 0 200 160" className="w-full h-full" aria-hidden="true">
        <defs>
          <linearGradient id="vidrio" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#DDEAF0" stopOpacity=".95" />
            <stop offset="45%" stopColor="#F4FAFC" stopOpacity=".75" />
            <stop offset="100%" stopColor="#C9DDE6" stopOpacity=".95" />
          </linearGradient>
        </defs>
        <path d="M72 8 L128 8 L118 60 Q132 96 118 150 L82 150 Q68 96 82 60 Z" fill="url(#vidrio)" stroke="#B9D2DC" strokeWidth="1.5" />
        <path d="M84 96 Q100 104 116 96 L116 148 Q100 154 84 148 Z" fill="#8FB6A0" opacity=".35" />
        <rect x="70" y="70" width="60" height="12" rx="6" fill={cinta.color} />
        <circle cx="100" cy="76" r="9" fill={cinta.color} />
        <circle cx="100" cy="76" r="3.5" fill="#000" opacity=".12" />
      </svg>
    )
  }

  if (formato.id === 'caja') {
    return (
      <svg viewBox="0 0 200 160" className="w-full h-full" aria-hidden="true">
        <ellipse cx="100" cy="46" rx="70" ry="18" fill="#F2E3E7" />
        <path d="M30 46 L30 118 Q30 140 100 140 Q170 140 170 118 L170 46 Z" fill="#F7EDF0" />
        <path d="M30 46 L30 118 Q30 140 100 140 L100 46 Z" fill="#000" opacity=".03" />
        <ellipse cx="100" cy="46" rx="70" ry="18" fill="none" stroke="#E4CDD4" strokeWidth="1.5" />
        <rect x="26" y="86" width="148" height="14" rx="3" fill={cinta.color} />
        <path d="M92 86 L100 78 L108 86 L100 94 Z" fill={cinta.color} />
        <circle cx="100" cy="93" r="8" fill={cinta.color} />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 200 160" className="w-full h-full" aria-hidden="true">
      <path d="M100 26 L172 88 Q140 150 100 150 Q60 150 28 88 Z" fill="#FBEFF2" />
      <path d="M100 26 L172 88 Q140 150 100 150 Z" fill="#000" opacity=".035" />
      <path d="M100 26 L172 88 Q140 150 100 150 Q60 150 28 88 Z" fill="none" stroke="#EFD8DE" strokeWidth="1.5" />
      <path d="M62 104 Q100 118 138 104 L134 118 Q100 132 66 118 Z" fill={cinta.color} />
      <circle cx="100" cy="114" r="10" fill={cinta.color} />
      <circle cx="100" cy="114" r="4" fill="#000" opacity=".12" />
    </svg>
  )
}
