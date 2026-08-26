import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import {
  FORMATOS, CINTAS, tramoPara, siguienteTramo,
  type Articulo, type TramoDescuento,
} from '../datos/catalogo'
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
  /** Piezas que faltan para el siguiente hito, o null si ya esta en el ultimo. */
  faltanPiezas: number | null
  porcentajeSiguiente: number | null
  /** Cuanto lleva recorrido hacia el ultimo hito, de 0 a 100. */
  avance: number
  llevaEnvioGratis: boolean
  /** Piezas del hito alcanzado, para poder nombrarlo en pantalla. */
  piezasDelHito: number | null
  /** Si el siguiente hito trae el envio, para no prometerlo de mas. */
  siguienteTraeEnvio: boolean
  tramos: TramoDescuento[]
}

const Contexto = createContext<Valor | null>(null)

export function ProveedorArreglo({ children }: { children: ReactNode }) {
  const { articulos, tramos: tramosSinOrden } = useConfig()

  // Ordenados por cantidad: tramoPara y siguienteTramo cuentan con eso, y en el
  // configurador los hitos se pueden teclear en cualquier orden.
  const tramos = useMemo(
    () => [...tramosSinOrden].sort((x, y) => x.piezas - y.piezas),
    [tramosSinOrden],
  )
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
        if (!articulo) return null

        // Si desde el configurador se baja el stock por debajo de lo que ya
        // estaba elegido, el carrito no puede seguir mostrando mas unidades de
        // las que hay.
        const cabe = Math.min(cantidad, articulo.stock)
        return cabe > 0 ? { articulo, cantidad: cabe } : null
      })
      .filter((l): l is Linea => l !== null)

    const formato = FORMATOS.find((f) => f.id === formatoId) ?? FORMATOS[0]
    const subtotal =
      formato.precio +
      lineas.reduce((suma, l) => suma + l.articulo.precio * l.cantidad, 0)

    const totalPiezas = lineas.reduce((s, l) => s + l.cantidad, 0)
    const tramo = tramoPara(totalPiezas, tramos)
    const siguiente = siguienteTramo(totalPiezas, tramos)
    const porcentaje = tramo?.porcentaje ?? 0
    const descuento = +(subtotal * (porcentaje / 100)).toFixed(2)

    /*
     * La barra mide el camino completo hasta el ultimo hito.
     *
     * Antes medía el trecho entre el hito alcanzado y el siguiente, y eso hacía
     * que al llegar a 3, 5 u 8 piezas la barra se vaciara y marcara 0% justo en
     * el momento en que el cliente acababa de ganar el descuento.
     */
    const meta = tramos.length ? tramos[tramos.length - 1].piezas : 0
    const avance = meta > 0 ? Math.min(100, Math.round((totalPiezas / meta) * 100)) : 0

    return {
      formatoId,
      cintaId,
      // Las cantidades salen de las lineas, ya recortadas al stock. Leyendo el
      // estado en bruto, la tarjeta seguia mostrando diez unidades elegidas
      // despues de que el stock bajara a dos.
      cantidades: Object.fromEntries(lineas.map((l) => [l.articulo.id, l.cantidad])),
      mensaje,
      elegirFormato: setFormatoId,
      elegirCinta: setCintaId,
      sumar: (id) => cambiar(id, 1),
      restar: (id) => cambiar(id, -1),
      quitar: (id) => setCantidades((p) => { const c = { ...p }; delete c[id]; return c }),
      limpiar: () => { setCantidades({}); setMensaje('') },
      escribirMensaje: setMensaje,
      lineas,
      totalPiezas,
      subtotal,
      porcentaje,
      descuento,
      total: +(subtotal - descuento).toFixed(2),
      faltanPiezas: siguiente ? siguiente.piezas - totalPiezas : null,
      porcentajeSiguiente: siguiente ? siguiente.porcentaje : null,
      avance,
      llevaEnvioGratis: tramo?.envioGratis ?? false,
      piezasDelHito: tramo?.piezas ?? null,
      siguienteTraeEnvio: siguiente?.envioGratis ?? false,
      tramos,
    }
  }, [formatoId, cintaId, cantidades, mensaje, articulos, tramos])

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

export function useArreglo() {
  const v = useContext(Contexto)
  if (!v) throw new Error('useArreglo tiene que usarse dentro de ProveedorArreglo')
  return v
}
