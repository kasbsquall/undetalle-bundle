import { useArreglo } from '../estado/ArregloContext'
import Recipiente from './Recipiente'
import Pieza from './Pieza'

/**
 * El arreglo armandose.
 *
 * Cada unidad que agrega el cliente cae dentro del recipiente y se queda. Las
 * posiciones se calculan a partir del indice, no al azar, para que una flor no
 * salte de sitio cada vez que la pantalla se vuelve a dibujar.
 */

interface Colocada {
  clave: string
  id: string
  nombre: string
  x: number
  y: number
  giro: number
  tamano: number
  orden: number
}

/** Ruido estable: el mismo texto siempre devuelve el mismo numero. */
function variacion(semilla: string): number {
  let h = 0
  for (let i = 0; i < semilla.length; i++) h = (h * 31 + semilla.charCodeAt(i)) | 0
  return ((h % 1000) / 1000 + 1) % 1
}

export default function VistaPrevia() {
  const { lineas, formatoId, cintaId, totalPiezas } = useArreglo()

  const piezas: Colocada[] = []
  let indice = 0

  // El follaje se dibuja primero para que quede detras de las flores.
  const ordenadas = [...lineas].sort((a, b) => {
    const peso = (c: string) => (c === 'follaje' ? 0 : c === 'flor' ? 1 : 2)
    return peso(a.articulo.categoria) - peso(b.articulo.categoria)
  })

  for (const linea of ordenadas) {
    for (let n = 0; n < linea.cantidad; n++) {
      const clave = `${linea.articulo.id}-${n}`
      const r1 = variacion(clave)
      const r2 = variacion(clave + 'b')

      // Se reparten en abanico: las primeras al centro, las siguientes abriendo.
      const anillo = Math.floor(indice / 5)
      const enAnillo = indice % 5
      const angulo = (-70 + enAnillo * 35 + (r1 - 0.5) * 18) * (Math.PI / 180)
      const radio = 15 + anillo * 13 + r2 * 6

      piezas.push({
        clave,
        id: linea.articulo.id,
        nombre: linea.articulo.nombre,
        x: 50 + Math.sin(angulo) * radio,
        y: 40 - Math.cos(angulo) * radio * 0.55 + anillo * 2,
        giro: (r1 - 0.5) * 40,
        tamano: 20 * linea.articulo.escala,
        orden: indice,
      })
      indice++
    }
  }

  return (
    <div className="relative w-full aspect-[4/5] rounded-2xl bg-gradient-to-b from-white to-marca-suave/60 border border-borde overflow-hidden">
      {totalPiezas === 0 && (
        <div className="absolute inset-0 flex items-center justify-center px-8 text-center">
          <p className="text-sm text-texto-suave leading-relaxed">
            Tu arreglo aparece aquí.<br />Empieza agregando tus flores.
          </p>
        </div>
      )}

      {/* Las flores, cayendo dentro */}
      <div className="absolute inset-x-0 top-[6%] bottom-[38%]">
        {piezas.map((p) => (
          <div
            key={p.clave}
            className="absolute animate-[caer_.42s_cubic-bezier(.23,1,.32,1)_both]"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.tamano}%`,
              height: `${p.tamano * 1.25}%`,
              transform: `translate(-50%,-50%) rotate(${p.giro}deg)`,
              zIndex: p.orden,
              animationDelay: `${Math.min(p.orden, 10) * 28}ms`,
            }}
          >
            <Pieza id={p.id} nombre={p.nombre} />
          </div>
        ))}
      </div>

      {/* El recipiente, siempre delante */}
      <div className="absolute inset-x-0 bottom-0 h-[46%] z-50">
        <Recipiente formatoId={formatoId} cintaId={cintaId} />
      </div>

      <style>{`
        @keyframes caer {
          from { opacity: 0; transform: translate(-50%, -180%) rotate(var(--giro, 0deg)) scale(.85); }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
