import { useState } from 'react'
import { Minus, Plus, Check, Flower, Leaf, Gift, PenNib } from '@phosphor-icons/react'
import { useArreglo } from '../estado/ArregloContext'
import { ARTICULOS, FORMATOS, CINTAS, type Categoria } from '../datos/catalogo'
import Panel from '../componentes/Panel'
import Recipiente from '../componentes/Recipiente'
import Encabezado from '../componentes/Encabezado'

const soles = (n: number) => 'S/ ' + n.toFixed(2)

/*
 * Cuatro pasos, no los cinco del boceto. Follajes y flores se juntaron porque
 * las dos cosas van dentro del arreglo y el follaje son tres opciones: un paso
 * entero para tres tarjetas se siente vacio. Y se agrego el paso de
 * presentacion, que el boceto no tenia, porque la vista previa necesita saber
 * en que va el arreglo antes de empezar a llenarlo.
 */
const PASOS = [
  { id: 1, nombre: 'Presentación', ayuda: 'Elige cómo va tu arreglo', icono: Gift },
  { id: 2, nombre: 'Flores y follaje', ayuda: 'Lo que va dentro', icono: Flower },
  { id: 3, nombre: 'Extras', ayuda: 'Para acompañar el detalle', icono: Leaf },
  { id: 4, nombre: 'Mensaje', ayuda: 'Tu dedicatoria', icono: PenNib },
]

function Contador({ id }: { id: string }) {
  const { cantidades, sumar, restar } = useArreglo()
  const cantidad = cantidades[id] ?? 0

  return (
    <div className="flex items-center rounded-xl border border-borde overflow-hidden">
      <button
        onClick={() => restar(id)}
        disabled={cantidad === 0}
        aria-label="Quitar uno"
        className="px-3 py-2 text-texto-suave hover:text-marca disabled:opacity-35 disabled:hover:text-texto-suave transition-colors"
      >
        <Minus size={14} weight="bold" />
      </button>
      <span className="cifra flex-1 text-center text-[.9rem] font-semibold">{cantidad}</span>
      <button
        onClick={() => sumar(id)}
        aria-label="Agregar uno"
        className="px-3 py-2 bg-marca text-white hover:bg-marca-oscura transition-colors"
      >
        <Plus size={14} weight="bold" />
      </button>
    </div>
  )
}

function Tarjetas({ categoria }: { categoria: Categoria }) {
  const { cantidades } = useArreglo()
  const items = ARTICULOS.filter((a) => a.categoria === categoria)

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((art) => {
        const elegido = (cantidades[art.id] ?? 0) > 0
        return (
          <div
            key={art.id}
            className={
              'rounded-2xl border bg-white overflow-hidden transition-all ' +
              (elegido ? 'border-marca shadow-[0_0_0_3px_rgba(236,80,112,.10)]' : 'border-borde')
            }
          >
            <div className="aspect-[4/3] bg-fondo p-3">
              <FotoArticulo id={art.id} nombre={art.nombre} />
            </div>
            <div className="p-3">
              <p className="font-semibold text-[.88rem] leading-tight">{art.nombre}</p>
              <p className="text-[.74rem] text-texto-suave mt-0.5 mb-1.5">{art.descripcion}</p>
              <p className="cifra text-[.86rem] font-semibold text-marca mb-2.5">{soles(art.precio)} c/u</p>
              <Contador id={art.id} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

import Pieza from '../componentes/Pieza'

function FotoArticulo({ id, nombre }: { id: string; nombre: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Pieza id={id} nombre={nombre} />
    </div>
  )
}

export default function Constructor() {
  const [paso, setPaso] = useState(1)
  const a = useArreglo()

  return (
    <div className="min-h-dvh">
      <Encabezado />

      <main className="max-w-[1240px] mx-auto px-4 py-6 lg:py-8">
        <div className="mb-6">
          <h1 className="text-[1.6rem] lg:text-[2rem] font-bold tracking-[-.02em]">
            Personaliza tu <span className="text-marca">arreglo floral</span>
          </h1>
          <p className="text-texto-suave text-[.92rem] mt-1">
            Elige tus flores y complementos favoritos. Mientras más agregas, mayor descuento obtienes.
          </p>
        </div>

        {/* Pasos */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-4 px-4 lg:mx-0 lg:px-0">
          {PASOS.map((p) => {
            const activo = paso === p.id
            const Icono = p.icono
            return (
              <button
                key={p.id}
                onClick={() => setPaso(p.id)}
                className={
                  'flex items-center gap-2.5 px-4 py-2.5 rounded-xl border whitespace-nowrap transition-all ' +
                  (activo
                    ? 'border-marca bg-marca-suave text-marca'
                    : 'border-borde bg-white text-texto-suave hover:border-marca/40')
                }
              >
                <span
                  className={
                    'w-5 h-5 rounded-full grid place-items-center text-[.7rem] font-bold shrink-0 ' +
                    (activo ? 'bg-marca text-white' : 'bg-borde text-white')
                  }
                >
                  {p.id}
                </span>
                <Icono size={17} weight="light" />
                <span className="text-[.88rem] font-medium">{p.nombre}</span>
              </button>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">
          <div className="bg-white rounded-2xl border border-borde p-5">
            <p className="text-[.83rem] text-texto-suave mb-4">
              {PASOS.find((p) => p.id === paso)?.ayuda}
            </p>

            {paso === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-semibold text-[.95rem] mb-3">Formato</h2>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {FORMATOS.map((f) => {
                      const activo = a.formatoId === f.id
                      return (
                        <button
                          key={f.id}
                          onClick={() => a.elegirFormato(f.id)}
                          className={
                            'text-left rounded-2xl border bg-white overflow-hidden transition-all ' +
                            (activo ? 'border-marca shadow-[0_0_0_3px_rgba(236,80,112,.10)]' : 'border-borde hover:border-marca/40')
                          }
                        >
                          <div className="aspect-[3/2] bg-fondo grid place-items-center p-2">
                            <div className="w-full h-full max-w-[130px]">
                              <Recipiente formatoId={f.id} cintaId={a.cintaId} />
                            </div>
                          </div>
                          <div className="p-3 flex items-start gap-2">
                            <div className="flex-1">
                              <p className="font-semibold text-[.88rem]">{f.nombre}</p>
                              <p className="text-[.74rem] text-texto-suave">{f.descripcion}</p>
                              <p className="cifra text-[.82rem] font-semibold text-marca mt-1">
                                {f.precio === 0 ? 'Incluido' : '+ ' + soles(f.precio)}
                              </p>
                            </div>
                            {activo && (
                              <span className="w-5 h-5 rounded-full bg-marca grid place-items-center shrink-0">
                                <Check size={12} weight="bold" className="text-white" />
                              </span>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h2 className="font-semibold text-[.95rem] mb-3">Color de la cinta</h2>
                  <div className="flex flex-wrap gap-2.5">
                    {CINTAS.map((c) => {
                      const activo = a.cintaId === c.id
                      return (
                        <button
                          key={c.id}
                          onClick={() => a.elegirCinta(c.id)}
                          className={
                            'flex items-center gap-2 pl-2 pr-3.5 py-2 rounded-xl border transition-all ' +
                            (activo ? 'border-marca bg-marca-suave' : 'border-borde bg-white hover:border-marca/40')
                          }
                        >
                          <span
                            className="w-6 h-6 rounded-full border border-black/10 shrink-0"
                            style={{ background: c.color }}
                          />
                          <span className="text-[.85rem]">{c.nombre}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {paso === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-semibold text-[.95rem] mb-3">Flores</h2>
                  <Tarjetas categoria="flor" />
                </div>
                <div>
                  <h2 className="font-semibold text-[.95rem] mb-3">Follaje y verdes</h2>
                  <Tarjetas categoria="follaje" />
                </div>
              </div>
            )}

            {paso === 3 && <Tarjetas categoria="extra" />}

            {paso === 4 && (
              <div>
                <label htmlFor="dedicatoria" className="block font-semibold text-[.95rem] mb-2">
                  Dedicatoria para la tarjeta
                </label>
                <textarea
                  id="dedicatoria"
                  value={a.mensaje}
                  onChange={(e) => a.escribirMensaje(e.target.value.slice(0, 400))}
                  rows={6}
                  placeholder="Escribe aquí el mensaje que irá en la tarjeta"
                  className="w-full rounded-xl border border-borde p-3.5 text-[.92rem] resize-none focus:outline-none focus:border-marca focus:ring-[3px] focus:ring-marca/12"
                />
                <p className="cifra text-[.75rem] text-texto-suave text-right mt-1.5">
                  {a.mensaje.length}/400
                </p>
              </div>
            )}

            <div className="flex gap-3 mt-6 pt-5 border-t border-borde">
              {paso > 1 && (
                <button
                  onClick={() => setPaso(paso - 1)}
                  className="px-5 py-2.5 rounded-xl border border-borde text-[.9rem] font-medium hover:border-marca/40 transition-colors"
                >
                  Atrás
                </button>
              )}
              {paso < PASOS.length && (
                <button
                  onClick={() => setPaso(paso + 1)}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-marca text-white text-[.9rem] font-semibold hover:bg-marca-oscura transition-colors"
                >
                  Siguiente
                </button>
              )}
            </div>
          </div>

          <aside className="lg:sticky lg:top-5">
            <Panel />
          </aside>
        </div>
      </main>
    </div>
  )
}
