import { Link } from 'react-router-dom'
import { Trash, Minus, Plus, X, Gift, Check, Crown } from '@phosphor-icons/react'
import { useArreglo } from '../estado/ArregloContext'
import { FORMATOS, CINTAS, type TramoDescuento } from '../datos/catalogo'
import { useConfig } from '../estado/ConfigContext'
import Recipiente from './Recipiente'
import Pieza from './Pieza'

const soles = (n: number) => 'S/ ' + n.toFixed(2)
const piezas = (n: number) => n + (n === 1 ? ' pieza' : ' piezas')

/**
 * El resumen del arreglo.
 *
 * Aqui vive el motor de la promesa: los hitos de descuento estan a la vista
 * desde que la pantalla carga, con los que ya se ganaron marcados. Antes solo
 * habia una barra y una tabla de montos al final, y la barra sola no decia que
 * se estaba ganando ni cuanto faltaba en algo que el cliente pudiera contar.
 */

export default function Panel() {
  const a = useArreglo()

  /*
   * Los tramos salen de la configuracion. Leidos del catalogo del codigo,
   * cambiar un hito desde el configurador movia el descuento que se cobra
   * mientras los hitos en pantalla seguian igual, con lo que la pantalla
   * prometia una cosa y cobraba otra.
   */
  const { tramos } = useConfig()
  const formato = FORMATOS.find((f) => f.id === a.formatoId) ?? FORMATOS[0]
  const cinta = CINTAS.find((c) => c.id === a.cintaId) ?? CINTAS[0]

  return (
    <div className="bg-white rounded-2xl border border-borde p-5">
      <div className="flex items-center justify-between mb-3.5">
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

      <div className="flex items-center justify-between mb-1.5">
        <p className="text-[.85rem] text-texto-suave">Llevas {piezas(a.totalPiezas)}</p>
        {a.porcentaje > 0 ? (
          <span className="cifra text-[.78rem] font-bold text-marca bg-marca-suave px-2 py-0.5 rounded-md">
            {a.porcentaje}% OFF
          </span>
        ) : (
          <span className="text-[.78rem] text-texto-suave">Sin descuento todavía</span>
        )}
      </div>

      <div
        className="h-2.5 rounded-full bg-borde overflow-hidden mb-4"
        role="progressbar"
        aria-valuenow={a.avance}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Avance hacia el descuento máximo"
      >
        <div
          className="h-full rounded-full bg-marca transition-[width] duration-500 ease-out"
          style={{ width: a.avance + '%' }}
        />
      </div>

      <Hitos tramos={tramos} piezasActuales={a.totalPiezas} />

      <p className="text-[.72rem] font-semibold tracking-[.06em] uppercase text-texto-suave mt-5 mb-2.5">
        Tu selección ({a.totalPiezas})
      </p>

      <div className="space-y-2.5 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-fondo p-1 shrink-0">
            <Recipiente formatoId={a.formatoId} cintaId={a.cintaId} />
          </div>
          <p className="flex-1 min-w-0 text-[.87rem] text-texto-suave truncate">
            {formato.nombre}, cinta {cinta.nombre.toLowerCase()}
          </p>
          <span className="cifra text-[.87rem]">
            {formato.precio === 0 ? 'Incluido' : soles(formato.precio)}
          </span>
        </div>

        {a.lineas.length === 0 && (
          <p className="text-[.82rem] text-texto-suave py-1">
            Todavía no eliges flores. Empieza por el paso 2.
          </p>
        )}

        {a.lineas.map(({ articulo, cantidad }) => (
          <div key={articulo.id} className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-fondo p-1 shrink-0">
              <Pieza id={articulo.id} nombre={articulo.nombre} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[.87rem] truncate">{articulo.nombre}</p>
              <p className="text-[.75rem] text-texto-suave cifra">{soles(articulo.precio)} c/u</p>
            </div>

            <div className="flex items-center rounded-lg border border-borde shrink-0">
              <button
                onClick={() => a.restar(articulo.id)}
                aria-label={'Quitar una unidad de ' + articulo.nombre}
                className="px-1.5 py-1.5 text-texto-suave hover:text-marca transition-colors"
              >
                <Minus size={13} weight="bold" />
              </button>
              <span className="cifra text-[.82rem] w-5 text-center">{cantidad}</span>
              <button
                onClick={() => a.sumar(articulo.id)}
                aria-label={'Agregar una unidad de ' + articulo.nombre}
                className="px-1.5 py-1.5 text-texto-suave hover:text-marca transition-colors"
              >
                <Plus size={13} weight="bold" />
              </button>
            </div>

            <span className="cifra text-[.87rem] font-medium w-[68px] text-right shrink-0 whitespace-nowrap">
              {soles(articulo.precio * cantidad)}
            </span>

            <button
              onClick={() => a.quitar(articulo.id)}
              aria-label={'Quitar ' + articulo.nombre + ' del arreglo'}
              className="text-texto-suave hover:text-marca transition-colors shrink-0"
            >
              <X size={15} weight="light" />
            </button>
          </div>
        ))}
      </div>

      <div className="space-y-1.5 text-[.88rem] pt-3 border-t border-borde">
        <div className="flex justify-between">
          <span className="text-texto-suave">Subtotal</span>
          <span className="cifra">{soles(a.subtotal)}</span>
        </div>
        {a.porcentaje > 0 && (
          <div className="flex justify-between">
            <span className="text-texto-suave">
              Descuento <span className="cifra">({a.porcentaje}% OFF)</span>
            </span>
            <span className="cifra text-marca">− {soles(a.descuento)}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-baseline pt-3 mb-1">
        <span className="font-semibold">Total del pack</span>
        <span className="cifra text-[1.45rem] font-bold text-marca">{soles(a.total)}</span>
      </div>
      <p className="text-[.74rem] text-texto-suave mb-4">El envío se calcula en el siguiente paso</p>

      {a.faltanPiezas === null && a.totalPiezas > 0 && (
        <p className="text-[.82rem] text-exito font-medium text-center mb-3">
          {a.llevaEnvioGratis
            ? 'Llegaste al descuento máximo y al envío gratis'
            : 'Llegaste al descuento máximo'}
        </p>
      )}

      {a.faltanPiezas !== null && a.totalPiezas > 0 && (
        <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl bg-marca-suave text-[.82rem] mb-3">
          <Gift size={18} weight="light" className="text-marca shrink-0 mt-0.5" />
          <p>
            Agrega <span className="cifra font-semibold">{piezas(a.faltanPiezas)}</span> y tu pack sube
            a <span className="cifra font-semibold text-marca">{a.porcentajeSiguiente}% OFF</span>
            {a.siguienteTraeEnvio && ' con envío gratis'}
          </p>
        </div>
      )}

      <Link
        to="/checkout"
        aria-disabled={a.totalPiezas === 0}
        onClick={(e) => {
          if (a.totalPiezas === 0) e.preventDefault()
        }}
        className={
          'flex items-center justify-center gap-2 w-full text-center py-3.5 rounded-xl font-semibold transition-all ' +
          (a.totalPiezas === 0
            ? 'bg-borde text-texto-suave cursor-not-allowed'
            : 'bg-marca text-white hover:bg-marca-oscura active:scale-[.99]')
        }
      >
        <Gift size={17} weight="light" />
        Agregar pack al carrito
      </Link>
    </div>
  )
}

/**
 * Los hitos de descuento.
 *
 * Se ven completos desde el arranque, incluso con el carrito vacio: el cliente
 * tiene que saber que hay algo que ganar desde el arranque, y enterarse al
 * llegar ya no cambia lo que compro. El alcanzado lleva check y el ultimo lleva corona porque ademas trae
 * el envio.
 */
function Hitos({
  tramos,
  piezasActuales,
}: {
  tramos: TramoDescuento[]
  piezasActuales: number
}) {
  const mejorAlcanzado = tramos.reduce<number>(
    (mejor, t, i) => (piezasActuales >= t.piezas ? i : mejor),
    -1,
  )

  return (
    <div>
      <p className="text-[.72rem] font-semibold tracking-[.06em] uppercase text-texto-suave mb-2">
        Descuentos por cantidad
      </p>
      <div className="grid grid-cols-4 gap-1.5">
        {tramos.map((t, i) => {
          const alcanzado = i <= mejorAlcanzado
          const actual = i === mejorAlcanzado
          return (
            <div
              key={t.piezas}
              className={
                'flex flex-col justify-end rounded-xl border px-1 pt-2.5 pb-2 text-center transition-colors ' +
                (actual
                  ? 'border-marca bg-marca-suave'
                  : alcanzado
                    ? 'border-marca/35 bg-white'
                    : 'border-borde bg-white')
              }
            >
              {t.envioGratis && (
                <Crown
                  size={14}
                  weight="light"
                  className={
                    'mx-auto mb-1 ' + (alcanzado ? 'text-marca' : 'text-texto-suave')
                  }
                />
              )}
              <p
                className={
                  'cifra text-[1.05rem] font-bold leading-none ' +
                  (alcanzado ? 'text-marca' : 'text-texto')
                }
              >
                {t.piezas}
              </p>
              <p className="text-[.58rem] leading-none text-texto-suave mt-0.5">piezas</p>
              <p
                className={
                  'cifra text-[.68rem] font-semibold mt-1 ' +
                  (alcanzado ? 'text-marca' : 'text-texto-suave')
                }
              >
                {t.porcentaje}% OFF
              </p>
              <div className="h-3.5 mt-0.5 grid place-items-center">
                {t.envioGratis ? (
                  <span
                    className={
                      'text-[.6rem] leading-none ' +
                      (alcanzado ? 'text-marca font-semibold' : 'text-texto-suave')
                    }
                  >
                    {alcanzado ? 'con envío' : '+ envío'}
                  </span>
                ) : alcanzado ? (
                  <Check size={11} weight="bold" className="text-marca" />
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
