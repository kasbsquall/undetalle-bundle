import { FORMATOS, CINTAS } from '../datos/catalogo'

/**
 * El recipiente donde se acomoda el arreglo.
 *
 * Va en vectores y no en foto porque el color de la cinta lo elige el cliente:
 * con fotos haria falta una imagen por cada combinacion de formato y color.
 *
 * El ramo esta dibujado siguiendo un ramo real, no de memoria: papel en cono
 * suave que se abre arriba, ceñido a media altura con el lazo, y por debajo el
 * cilindro de papel que envuelve los tallos y le permite quedar de pie.
 */

interface Props {
  formatoId: string
  cintaId: string
}

/**
 * Donde queda la boca de cada recipiente, en porcentaje del alto de la vista
 * previa, contando desde abajo.
 *
 * Estos numeros no son a ojo: el recipiente ocupa el 58% inferior de la vista y
 * dentro de su viewBox de 170 la boca esta a una altura conocida, asi que salen
 * de (170 - alturaDeLaBoca) / 170 * 58. Se les resta un poco para que la primera
 * fila de piezas quede metida dentro y no flotando encima.
 *
 * Cuando estaban mal puestos, las flores aparecian al costado del recipiente en
 * lugar de saliendo de el.
 */
export const BOCA: Record<string, { y: number; ancho: number }> = {
  ramo: { y: 39, ancho: 80 },
  caja: { y: 41, ancho: 70 },
  florero: { y: 50, ancho: 42 },
}

export default function Recipiente({ formatoId, cintaId }: Props) {
  const formato = FORMATOS.find((f) => f.id === formatoId) ?? FORMATOS[0]
  const cinta = CINTAS.find((c) => c.id === cintaId) ?? CINTAS[0]

  if (formato.id === 'florero') {
    return (
      <svg viewBox="0 0 200 170" className="w-full h-full" aria-hidden="true">
        <defs>
          <linearGradient id="vidrio" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#CFE1E9" />
            <stop offset="38%" stopColor="#F6FBFD" />
            <stop offset="72%" stopColor="#E2EFF4" />
            <stop offset="100%" stopColor="#BFD6E0" />
          </linearGradient>
        </defs>
        <path d="M74 6 L126 6 L120 54 Q136 92 124 162 L76 162 Q64 92 80 54 Z"
          fill="url(#vidrio)" stroke="#AEC9D4" strokeWidth="1.4" />
        <path d="M79 92 Q100 100 121 92 L119 158 Q100 164 81 158 Z" fill="#8FB6A0" opacity=".28" />
        <ellipse cx="100" cy="7" rx="26" ry="5" fill="#EAF4F8" stroke="#AEC9D4" strokeWidth="1.2" />
        <rect x="72" y="66" width="56" height="11" rx="5.5" fill={cinta.color} />
        <circle cx="100" cy="71" r="8" fill={cinta.color} />
        <circle cx="100" cy="71" r="3" fill="#000" opacity=".14" />
      </svg>
    )
  }

  if (formato.id === 'caja') {
    return (
      <svg viewBox="0 0 200 170" className="w-full h-full" aria-hidden="true">
        <ellipse cx="100" cy="30" rx="72" ry="19" fill="#EFDDE2" />
        <ellipse cx="100" cy="30" rx="63" ry="14" fill="#E2CAD1" />
        <path d="M28 30 L28 118 Q28 146 100 146 Q172 146 172 118 L172 30 Z" fill="#F8EEF1" />
        <path d="M28 30 L28 118 Q28 146 100 146 L100 30 Z" fill="#000" opacity=".035" />
        <ellipse cx="100" cy="30" rx="72" ry="19" fill="none" stroke="#E0C6CE" strokeWidth="1.5" />
        <rect x="24" y="82" width="152" height="15" rx="3" fill={cinta.color} />
        <path d="M100 74 L112 84 L100 94 L88 84 Z" fill={cinta.color} opacity=".85" />
        <circle cx="100" cy="90" r="9" fill={cinta.color} />
        <circle cx="100" cy="90" r="3.4" fill="#000" opacity=".14" />
      </svg>
    )
  }

  // Ramo envuelto
  return (
    <svg viewBox="0 0 200 170" className="w-full h-full" aria-hidden="true">
      <defs>
        <linearGradient id="papel" x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0%" stopColor="#FAE6EC" />
          <stop offset="42%" stopColor="#FDF4F6" />
          <stop offset="100%" stopColor="#F3D9E1" />
        </linearGradient>
      </defs>

      {/* Panel de papel de atras, asomando por los lados */}
      <path d="M12 30 Q26 96 74 112 L126 112 Q174 96 188 30 Q150 52 100 52 Q50 52 12 30 Z"
        fill="#F2DCE3" opacity=".85" />

      {/* Cono principal del papel */}
      <path d="M22 26 Q34 100 78 116 L122 116 Q166 100 178 26 Q142 50 100 50 Q58 50 22 26 Z"
        fill="url(#papel)" stroke="#EBCBD6" strokeWidth="1.2" />

      {/* Pliegues */}
      <path d="M64 44 Q74 92 88 114" fill="none" stroke="#E9C8D3" strokeWidth="1.1" opacity=".75" />
      <path d="M136 44 Q126 92 112 114" fill="none" stroke="#E9C8D3" strokeWidth="1.1" opacity=".75" />
      <path d="M100 50 L100 116" fill="none" stroke="#E9C8D3" strokeWidth="1" opacity=".5" />

      {/* Cilindro de papel que envuelve los tallos */}
      <path d="M78 116 Q76 142 80 160 Q100 166 120 160 Q124 142 122 116 Z"
        fill="#FBEFF3" stroke="#EBCBD6" strokeWidth="1.2" />
      <path d="M92 118 Q90 142 93 162" fill="none" stroke="#EBCBD6" strokeWidth="1" opacity=".6" />
      <path d="M110 118 Q112 142 109 162" fill="none" stroke="#EBCBD6" strokeWidth="1" opacity=".6" />

      {/* El lazo, en el punto donde se ciñe */}
      <path d="M100 118 Q78 106 68 118 Q76 132 100 124 Z" fill={cinta.color} />
      <path d="M100 118 Q122 106 132 118 Q124 132 100 124 Z" fill={cinta.color} />
      <path d="M96 124 L88 148 L99 141 Z" fill={cinta.color} opacity=".9" />
      <path d="M104 124 L112 148 L101 141 Z" fill={cinta.color} opacity=".9" />
      <circle cx="100" cy="121" r="6.5" fill={cinta.color} />
      <circle cx="100" cy="121" r="2.4" fill="#000" opacity=".16" />
    </svg>
  )
}
