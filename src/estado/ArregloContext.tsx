import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { FORMATOS, CINTAS, tramoPara, siguienteTramo, type Articulo } from '../datos/catalogo'
import { useConfig } from './ConfigContext'

/**
 * Todo el estado del arreglo vive aqui: que formato eligio, que cinta, cuantas
 * unidades de cada articulo y la dedicatoria. Las cuentas se derivan de eso, no
 * se guardan, para que no puedan quedar desincronizadas.
 */

interface Linea {
  articulo: Articulo
  cantidad: number
}

interface Valor {
  formatoId: string
  cintaId: string
  cantidades: Record<string, number>
  mensaje: string
  elegirFormato: (id: string) => void
  elegirCinta: (id: string) => void
  sumar: (id: string) => void
  restar: (id: string) => void
  quitar: (id: string) => void
  limpiar: () => void
  escribirMensaje: (texto: string) => void
  lineas: Linea[]
  totalPiezas: number
  subtotal: number
  porcentaje: number
  descuento: number
  total: number
  faltaParaSiguiente: number | null
  porcentajeSiguiente: number | null
  llevaEnvioGratis: boolean
  faltaParaEnvioGratis: number
}

const Contexto = createContext<Valor | null>(null)

export function ProveedorArreglo({ children }: { children: ReactNode }) {
  const { articulos, tramos, envioGratisDesde } = useConfig()
  const [formatoId, setFormatoId] = useState(FORMATOS[0].id)
  const [cintaId, setCintaId] = useState(CINTAS[0].id)
  const [cantidades, setCantidades] = useState<Record<string, number>>({})
  const [mensaje, setMensaje] = useState('')

  const cambiar = (id: string, delta: number) =>
    setCantidades((prev) => {
      const tope = articulos.find((a) => a.id === id)?.stock ?? 0
      const siguiente = Math.min(tope, Math.max(0, (prev[id] ?? 0) + delta))
      const copia = { ...prev }
      if (siguiente === 0) delete copia[id]
      else copia[id] = siguiente
      return copia
    })

  const valor = useMemo<Valor>(() => {
    const lineas: Linea[] = Object.entries(cantidades)
      .map(([id, cantidad]) => {
        const articulo = articulos.find((a) => a.id === id)
        return articulo ? { articulo, cantidad } : null
      })
      .filter((l): l is Linea => l !== null)

    const formato = FORMATOS.find((f) => f.id === formatoId) ?? FORMATOS[0]
    const subtotal =
      formato.precio +
      lineas.reduce((suma, l) => suma + l.articulo.precio * l.cantidad, 0)

    const tramo = tramoPara(subtotal, tramos)
    const siguiente = siguienteTramo(subtotal, tramos)
    const descuento = +(subtotal * (tramo.porcentaje / 100)).toFixed(2)

    return {
      formatoId,
      cintaId,
      cantidades,
      mensaje,
      elegirFormato: setFormatoId,
      elegirCinta: setCintaId,
      sumar: (id) => cambiar(id, 1),
      restar: (id) => cambiar(id, -1),
      quitar: (id) => setCantidades((p) => { const c = { ...p }; delete c[id]; return c }),
      limpiar: () => { setCantidades({}); setMensaje('') },
      escribirMensaje: setMensaje,
      lineas,
      totalPiezas: lineas.reduce((s, l) => s + l.cantidad, 0),
      subtotal,
      porcentaje: tramo.porcentaje,
      descuento,
      total: +(subtotal - descuento).toFixed(2),
      faltaParaSiguiente: siguiente ? +(siguiente.desde - subtotal).toFixed(2) : null,
      porcentajeSiguiente: siguiente ? siguiente.porcentaje : null,
      llevaEnvioGratis: subtotal >= envioGratisDesde,
      faltaParaEnvioGratis: +Math.max(0, envioGratisDesde - subtotal).toFixed(2),
    }
  }, [formatoId, cintaId, cantidades, mensaje, articulos, tramos, envioGratisDesde])

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

export function useArreglo() {
  const v = useContext(Contexto)
  if (!v) throw new Error('useArreglo tiene que usarse dentro de ProveedorArreglo')
  return v
}
