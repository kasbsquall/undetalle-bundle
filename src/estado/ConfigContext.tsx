import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  ARTICULOS, TRAMOS,
  type Articulo, type TramoDescuento,
} from '../datos/catalogo'

/**
 * La configuracion del bundle: que material hay, a que precio, cuanto stock, y
 * que descuento se da al llegar a cada cantidad de piezas.
 *
 * En el producto real esto vive en la base de datos y se administra desde el
 * panel de WordPress. Aqui se guarda en el navegador para que el prototipo
 * funcione sin servidor, pero la pantalla de configuracion es la misma y los
 * cambios se ven en la tienda al instante, que es lo que hay que enseñar.
 */

// La v2 es porque los tramos pasaron de monto a cantidad de piezas. Sin
// cambiar la llave, una configuracion vieja guardada en el navegador se
// mezclaria con la nueva forma y los descuentos saldrian en blanco.
const LLAVE = 'undetalle-bundle-config-v2'

interface Config {
  articulos: Articulo[]
  tramos: TramoDescuento[]
}

interface Valor extends Config {
  editarArticulo: (id: string, cambios: Partial<Articulo>) => void
  editarTramo: (indice: number, cambios: Partial<TramoDescuento>) => void
  restablecer: () => void
  hayCambios: boolean
}

const PorDefecto: Config = {
  articulos: ARTICULOS,
  tramos: TRAMOS,
}

const Contexto = createContext<Valor | null>(null)

function leerGuardado(): Config {
  try {
    const crudo = localStorage.getItem(LLAVE)
    if (!crudo) return PorDefecto
    const guardado = JSON.parse(crudo) as Partial<Config>

    /*
     * Se mezcla con el catalogo del codigo en vez de confiar en lo guardado:
     * si mañana se agrega un material nuevo, quien ya tenga configuracion vieja
     * lo ve igual, y no se pierde la imagen ni la escala de dibujo.
     */
    const articulos = ARTICULOS.map((base) => {
      const g = guardado.articulos?.find((a) => a.id === base.id)
      return g ? { ...base, precio: g.precio, stock: g.stock } : base
    })

    const tramos =
      guardado.tramos?.length === TRAMOS.length && guardado.tramos.every((t) => typeof t.piezas === 'number')
        ? guardado.tramos
        : TRAMOS

    return { articulos, tramos }
  } catch {
    return PorDefecto
  }
}

export function ProveedorConfig({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<Config>(leerGuardado)

  useEffect(() => {
    try {
      localStorage.setItem(LLAVE, JSON.stringify(config))
    } catch {
      // Si el navegador no deja guardar, el prototipo sigue funcionando en
      // memoria. No vale la pena molestar al usuario con eso.
    }
  }, [config])

  const valor: Valor = {
    ...config,
    editarArticulo: (id, cambios) =>
      setConfig((c) => ({
        ...c,
        articulos: c.articulos.map((a) => (a.id === id ? { ...a, ...cambios } : a)),
      })),
    editarTramo: (indice, cambios) =>
      setConfig((c) => ({
        ...c,
        tramos: c.tramos.map((t, i) => (i === indice ? { ...t, ...cambios } : t)),
      })),
    restablecer: () => {
      try {
        localStorage.removeItem(LLAVE)
      } catch {
        /* da igual */
      }
      setConfig(PorDefecto)
    },
    hayCambios: JSON.stringify(config) !== JSON.stringify(PorDefecto),
  }

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

export function useConfig() {
  const v = useContext(Contexto)
  if (!v) throw new Error('useConfig tiene que usarse dentro de ProveedorConfig')
  return v
}
