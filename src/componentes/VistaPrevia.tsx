import { useArreglo } from '../estado/ArregloContext'
import Recipiente, { BOCA } from './Recipiente'
import Pieza from './Pieza'

/**
 * El arreglo armandose dentro del recipiente.
 *
 * Las piezas se acomodan por filas, de abajo hacia arriba, como cuando metes
 * cosas en una canasta: cada una tiene su sitio y se ve entera. Antes se
 * repartian en espiral imitando un ramo de verdad, y con muchas flores se
 * convertia en una mancha donde no se distinguia nada.
 *
 * Este criterio ademas aguanta cualquier producto. En el bundle no solo hay
 * flores: hay chocolates, un peluche y una botella de vino, y esas cosas nunca
 * iban a encajar dentro de un ramo.
 *
 * Las posiciones salen del indice y no del azar, para que una pieza no salte de
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
}

/** Ruido estable: el mismo texto siempre devuelve el mismo numero. */
function variacion(semilla: string): number {
  let h = 0
  for (let i = 0; i < semilla.length; i++) h = (h * 31 + semilla.charCodeAt(i)) | 0
  return Math.abs(h % 1000) / 1000
}

export default function VistaPrevia() {
  const { lineas, formatoId, cintaId, totalPiezas } = useArreglo()
  const boca = BOCA[formatoId] ?? BOCA.ramo

  // Follaje al fondo, flores en medio, extras delante.
  const ordenadas = [...lineas].sort((a, b) => {
    const peso = (c: string) => (c === 'follaje' ? 0 : c === 'flor' ? 1 : 2)
    return peso(a.articulo.categoria) - peso(b.articulo.categoria)
  })

  const unidades: Array<{ clave: string; id: string; nombre: string; escala: number }> = []
  for (const linea of ordenadas) {
    for (let n = 0; n < linea.cantidad; n++) {
      unidades.push({
        clave: linea.articulo.id + '-' + n,
        id: linea.articulo.id,
        nombre: linea.articulo.nombre,
        escala: linea.articulo.escala,
      })
    }
  }

  const total = unidades.length

  /*
   * El tamano de pieza baja segun se van agregando cosas, para que el monton
   * crezca pero no se desborde. Con pocas piezas se ven grandes, que es cuando
   * conviene lucirlas.
   */
  const tamanoBase = total <= 3 ? 30 : total <= 8 ? 26 : total <= 16 ? 22 : 18
  const porFila = Math.max(2, Math.round(boca.ancho / (tamanoBase * 0.8)))
  const altoFila = tamanoBase * 0.62
  const pasoX = boca.ancho / porFila

  const piezas: Colocada[] = unidades.map((u, i) => {
    const fila = Math.floor(i / porFila)
    const enFila = i % porFila
    const cuantasAqui = Math.min(porFila, total - fila * porFila)

    // Cada fila se centra sobre la boca; las impares van algo corridas para que
    // el apilado no forme una reja.
    const anchoFila = cuantasAqui * pasoX
    const inicio = 50 - anchoFila / 2 + pasoX / 2
    const corrido = fila % 2 === 1 ? pasoX * 0.3 : 0
    const r = variacion(u.clave)

    return {
      clave: u.clave,
      id: u.id,
      nombre: u.nombre,
      x: inicio + enFila * pasoX + corrido + (r - 0.5) * 2.5,
      y: boca.y + fila * altoFila + (r - 0.5) * 2,
      giro: (r - 0.5) * 24,
      tamano: tamanoBase * u.escala,
      orden: i,
    }
  })

  return (
    <div className="relative w-full aspect-[4/5] rounded-2xl bg-gradient-to-b from-white to-marca-suave/45 border border-borde overflow-hidden">
      {totalPiezas === 0 && (
        <div className="absolute inset-0 flex items-center justify-center px-8 text-center z-10">
          <p className="text-[.86rem] text-texto-suave leading-relaxed">
            Tu arreglo aparece aquí.
            <br />
            Empieza eligiendo tus flores.
          </p>
        </div>
      )}

      <div className="absolute inset-0">
        {piezas.map((p) => (
          <div
            key={p.clave}
            className="absolute animate-[entrar_.42s_cubic-bezier(.2,.9,.3,1.2)_both]"
            style={{
              left: p.x + '%',
              bottom: p.y + '%',
              width: p.tamano + '%',
              height: p.tamano + '%',
              marginLeft: -p.tamano / 2 + '%',
              zIndex: 10 + p.orden,
              animationDelay: Math.min(p.orden, 14) * 24 + 'ms',
            }}
          >
            <div className="w-full h-full" style={{ transform: 'rotate(' + p.giro + 'deg)' }}>
              <Pieza id={p.id} nombre={p.nombre} />
            </div>
          </div>
        ))}
      </div>

      {/* El recipiente, siempre delante de lo que lleva dentro. */}
      <div className="absolute inset-x-0 bottom-0 h-[46%] z-[400]">
        <Recipiente formatoId={formatoId} cintaId={cintaId} />
      </div>

      <style>{`
        @keyframes entrar {
          from { opacity: 0; transform: translateY(-42px) scale(.72); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}
