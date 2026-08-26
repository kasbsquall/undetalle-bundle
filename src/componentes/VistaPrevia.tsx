import { useArreglo } from '../estado/ArregloContext'
import Recipiente from './Recipiente'
import Pieza from './Pieza'

/**
 * El arreglo armandose.
 *
 * Las flores se reparten en espiral, con el mismo criterio con el que crecen
 * las semillas de un girasol: cada una a 137.5 grados de la anterior y a una
 * distancia proporcional a la raiz de su posicion. Eso da un ramo denso en el
 * centro que se abre hacia afuera, que es como se ve uno de verdad. Repartirlas
 * en fila daba una banda plana que no parecia un arreglo.
 *
 * Las posiciones salen del indice y no del azar, para que una flor no salte de
 * sitio cada vez que la pantalla se vuelve a dibujar.
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
  /** 0 el follaje al fondo, 1 las flores, 2 los extras delante. */
  capa: number
}

const ANGULO_DORADO = 137.508 * (Math.PI / 180)

/** Ruido estable: el mismo texto siempre devuelve el mismo numero. */
function variacion(semilla: string): number {
  let h = 0
  for (let i = 0; i < semilla.length; i++) h = (h * 31 + semilla.charCodeAt(i)) | 0
  return Math.abs(h % 1000) / 1000
}

export default function VistaPrevia() {
  const { lineas, formatoId, cintaId, totalPiezas } = useArreglo()

  /*
   * Las flores van primero en la espiral, asi ocupan el centro del ramo. El
   * follaje va al final, que es donde la espiral ya se abrio, y por eso queda
   * asomando por los bordes. La profundidad no la da este orden sino el
   * z-index, que se calcula aparte: el verde siempre por detras.
   */
  const ordenadas = [...lineas].sort((a, b) => {
    const peso = (c: string) => (c === 'flor' ? 0 : c === 'extra' ? 1 : 2)
    return peso(a.articulo.categoria) - peso(b.articulo.categoria)
  })

  const unidades: Array<{ clave: string; id: string; nombre: string; escala: number; categoria: string }> = []
  for (const linea of ordenadas) {
    for (let n = 0; n < linea.cantidad; n++) {
      unidades.push({
        clave: linea.articulo.id + '-' + n,
        id: linea.articulo.id,
        nombre: linea.articulo.nombre,
        escala: linea.articulo.escala,
        categoria: linea.articulo.categoria,
      })
    }
  }

  // Con pocas flores el ramo tiene que verse compacto; con muchas, abrirse sin
  // salirse de la caja. El paso de la espiral se ajusta a la cantidad.
  const total = unidades.length
  const apertura = Math.min(15, 7.5 + 34 / Math.max(4, total))

  const piezas: Colocada[] = unidades.map((u, i) => {
    const r1 = variacion(u.clave)
    const angulo = i * ANGULO_DORADO
    const distancia = apertura * Math.sqrt(i)

    // Elipse: el ramo es mas ancho que alto.
    const x = 50 + Math.cos(angulo) * distancia * 1.28
    const y = 52 + Math.sin(angulo) * distancia * 0.86

    // El follaje se sale un poco mas, que es lo que hace de fondo verde.
    const empuje = u.categoria === 'follaje' ? 1.18 : 1

    return {
      clave: u.clave,
      id: u.id,
      nombre: u.nombre,
      x: 50 + (x - 50) * empuje,
      y: 52 + (y - 52) * empuje,
      giro: (r1 - 0.5) * 46,
      // Las de afuera un poco mas chicas: da sensacion de profundidad.
      tamano: (25 - Math.min(7, distancia * 0.32)) * u.escala,
      orden: i,
      capa: u.categoria === 'follaje' ? 0 : u.categoria === 'flor' ? 1 : 2,
    }
  })

  return (
    <div className="relative w-full aspect-[4/5] rounded-2xl bg-gradient-to-b from-white to-marca-suave/50 border border-borde overflow-hidden">
      {totalPiezas === 0 && (
        <div className="absolute inset-0 flex items-center justify-center px-8 text-center">
          <p className="text-[.86rem] text-texto-suave leading-relaxed">
            Tu arreglo aparece aquí.
            <br />
            Empieza eligiendo tus flores.
          </p>
        </div>
      )}

      {/* Las flores. Ocupan la mitad de arriba y se apoyan sobre el recipiente. */}
      <div className="absolute inset-x-0 top-0 h-[64%]">
        {piezas.map((p) => (
          <div
            key={p.clave}
            className="absolute animate-[caer_.5s_cubic-bezier(.23,1,.32,1)_both]"
            style={{
              left: p.x + '%',
              top: p.y + '%',
              width: p.tamano + '%',
              height: p.tamano * 1.2 + '%',
              marginLeft: -p.tamano / 2 + '%',
              zIndex: p.capa * 100 + p.orden,
              ['--giro' as string]: p.giro + 'deg',
              animationDelay: Math.min(p.orden, 12) * 26 + 'ms',
            }}
          >
            <div style={{ transform: 'rotate(' + p.giro + 'deg)' }} className="w-full h-full">
              <Pieza id={p.id} nombre={p.nombre} />
            </div>
          </div>
        ))}
      </div>

      {/* El recipiente, siempre delante de las flores. */}
      <div className="absolute inset-x-0 bottom-[2%] h-[44%] z-[500]">
        <Recipiente formatoId={formatoId} cintaId={cintaId} />
      </div>

      <style>{`
        @keyframes caer {
          from { opacity: 0; transform: translateY(-90px) scale(.8); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}
