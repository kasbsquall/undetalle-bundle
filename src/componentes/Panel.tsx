import { Link } from 'react-router-dom'
import { Trash, Minus, Plus, X, Truck } from '@phosphor-icons/react'
import { useArreglo } from '../estado/ArregloContext'
import { TRAMOS, FORMATOS, ENVIO_GRATIS_DESDE } from '../datos/catalogo'
import VistaPrevia from './VistaPrevia'

const soles = (n: number) => 'S/ ' + n.toFixed(2)

export default function Panel() {
  const a = useArreglo()
  const formato = FORMATOS.find((f) => f.id === a.formatoId) ?? FORMATOS[0]

  // La barra mide lo que lleva avanzado dentro del tramo en el que esta, no
  // sobre el total: asi siempre se ve movimiento al agregar algo.
  const tramoActual = TRAMOS.find((t) => t.porcentaje === a.porcentaje) ?? TRAMOS[0]
  const meta = a.faltaParaSiguiente !== null ? a.subtotal + a.faltaParaSiguiente : a.subtotal
  const recorrido = meta - tramoActual.desde
  const avance = recorrido > 0
    ? Math.min(100, Math.round(((a.subtotal - tramoActual.desde) / recorrido) * 100))
    : 100

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-borde p-5">
        <h2 className="font-semibold text-[1.02rem] mb-3.5">Vista previa</h2>
        <VistaPrevia />
        <p className="mt-2.5 text-[.72rem] text-texto-suave text-center">
          La vista previa es una referencia de tu combinación
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-borde p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-[1.02rem]">Tu arreglo</h2>
          {a.totalPiezas > 0 && (
            <button
              onClick={a.limpiar}
              className="flex items-center gap-1.5 text-[.8rem] text-marca hover:text-marca-oscura transition-colors"
            >
              <Trash size={15} weight="light" /> Limpiar todo
            </button>
          )}
        </div>

        <p className="text-[.85rem] text-texto-suave mb-2">
          Llevas {a.totalPiezas} {a.totalPiezas === 1 ? 'pieza' : 'piezas'}
        </p>

        <div className="flex items-center gap-3 mb-2">
          <div className="flex-1 h-2.5 rounded-full bg-borde overflow-hidden">
            <div
              className="h-full rounded-full bg-marca transition-[width] duration-500 ease-out"
              style={{ width: avance + '%' }}
            />
          </div>
          {a.porcentaje > 0 && (
            <span className="cifra text-[.78rem] font-bold text-marca bg-marca-suave px-2 py-0.5 rounded-md whitespace-nowrap">
              −{a.porcentaje}%
            </span>
          )}
        </div>

        {a.faltaParaSiguiente !== null ? (
          <p className="text-[.83rem] text-texto-suave mb-4">
            Te faltan <span className="cifra font-semibold text-texto">{soles(a.faltaParaSiguiente)}</span> para
            el <span className="font-semibold text-marca">{a.porcentajeSiguiente}%</span> de descuento
          </p>
        ) : (
          <p className="text-[.83rem] text-exito font-medium mb-4">Ya tienes el descuento máximo</p>
        )}

        <div className="space-y-2.5 mb-4">
          <div className="flex items-center gap-3 text-[.87rem]">
            <span className="flex-1 text-texto-suave">{formato.nombre}</span>
            <span className="cifra">{formato.precio === 0 ? 'Incluido' : soles(formato.precio)}</span>
          </div>

          {a.lineas.map(({ articulo, cantidad }) => (
            <div key={articulo.id} className="flex items-center gap-2.5">
              <div className="flex-1 min-w-0">
                <p className="text-[.87rem] truncate">{articulo.nombre}</p>
                <p className="text-[.75rem] text-texto-suave cifra">{soles(articulo.precio)} c/u</p>
              </div>
              <span className="cifra text-[.87rem] font-medium w-[62px] text-right">
                {soles(articulo.precio * cantidad)}
              </span>
              <div className="flex items-center rounded-lg border border-borde">
                <button
                  onClick={() => a.restar(articulo.id)}
                  aria-label={'Quitar un ' + articulo.nombre}
                  className="px-2 py-1.5 text-texto-suave hover:text-marca transition-colors"
                >
                  <Minus size={13} weight="bold" />
                </button>
                <span className="cifra text-[.82rem] w-6 text-center">{cantidad}</span>
                <button
                  onClick={() => a.sumar(articulo.id)}
                  aria-label={'Agregar un ' + articulo.nombre}
                  className="px-2 py-1.5 text-texto-suave hover:text-marca transition-colors"
                >
                  <Plus size={13} weight="bold" />
                </button>
              </div>
              <button
                onClick={() => a.quitar(articulo.id)}
                aria-label={'Sacar ' + articulo.nombre}
                className="text-texto-suave hover:text-marca transition-colors"
              >
                <X size={15} weight="light" />
              </button>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-borde overflow-hidden mb-4">
          <p className="px-3.5 py-2 text-[.78rem] font-semibold bg-fondo">Descuentos por monto</p>
          {TRAMOS.map((t) => {
            const activo = t.porcentaje === a.porcentaje
            return (
              <div
                key={t.desde}
                className={
                  'flex justify-between px-3.5 py-1.5 text-[.82rem] ' +
                  (activo ? 'bg-marca-suave font-semibold text-marca' : 'text-texto-suave')
                }
              >
                <span className="cifra">
                  {t.hasta === null ? 'S/ ' + t.desde + ' o más' : 'S/ ' + t.desde + ' - S/ ' + t.hasta}
                </span>
                <span className="cifra">{t.porcentaje}%</span>
              </div>
            )
          })}
        </div>

        <div className="space-y-1.5 text-[.88rem] pb-3 border-b border-borde">
          <div className="flex justify-between">
            <span className="text-texto-suave">Subtotal</span>
            <span className="cifra">{soles(a.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-texto-suave">Descuento ({a.porcentaje}%)</span>
            <span className="cifra text-marca">− {soles(a.descuento)}</span>
          </div>
        </div>

        <div className="flex justify-between items-baseline pt-3 mb-4">
          <span className="font-semibold">Total</span>
          <span className="cifra text-[1.45rem] font-bold text-marca">{soles(a.total)}</span>
        </div>

        <Link
          to="/checkout"
          aria-disabled={a.totalPiezas === 0}
          onClick={(e) => {
            if (a.totalPiezas === 0) e.preventDefault()
          }}
          className={
            'block w-full text-center py-3.5 rounded-xl font-semibold transition-all ' +
            (a.totalPiezas === 0
              ? 'bg-borde text-texto-suave cursor-not-allowed'
              : 'bg-marca text-white hover:bg-marca-oscura active:scale-[.99]')
          }
        >
          Continuar
        </Link>

        <div
          className={
            'mt-2.5 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[.82rem] ' +
            (a.llevaEnvioGratis ? 'bg-exito-suave text-exito' : 'bg-fondo text-texto-suave')
          }
        >
          <Truck size={16} weight="light" />
          {a.llevaEnvioGratis ? 'Tu envío va gratis' : 'Envío gratis desde S/ ' + ENVIO_GRATIS_DESDE}
        </div>
      </div>

    </div>
  )
}
