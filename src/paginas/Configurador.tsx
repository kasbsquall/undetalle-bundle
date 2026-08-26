import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Info, ArrowCounterClockwise, Check } from '@phosphor-icons/react'
import { FORMATOS } from '../datos/catalogo'
import { useConfig } from '../estado/ConfigContext'
import Encabezado from '../componentes/Encabezado'
import Pieza from '../componentes/Pieza'

const soles = (n: number) => 'S/ ' + n.toFixed(2)

/**
 * La pantalla que responde la pregunta de quien administra la tienda: esto lo
 * cargo yo.
 *
 * Lo que se cambia aqui se ve en la tienda al instante. En el prototipo se
 * guarda en el navegador; en el producto real vive en la base de datos y esta
 * pantalla es la del panel de WordPress.
 */

function Numero({
  valor,
  onChange,
  sufijo,
  prefijo,
  ancho = 'w-24',
}: {
  valor: number
  onChange: (n: number) => void
  sufijo?: string
  prefijo?: string
  ancho?: string
}) {
  /*
   * El texto se guarda tal cual mientras se escribe y solo se propaga el numero
   * al salir del campo. Validando en cada tecla, borrar el contenido para
   * reemplazarlo hacia que el campo saltara solo al minimo.
   */
  const [texto, setTexto] = useState<string | null>(null)

  return (
    <div className={'relative ' + ancho}>
      {prefijo && (
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[.78rem] text-texto-suave pointer-events-none">
          {prefijo}
        </span>
      )}
      <input
        type="number"
        min={0}
        value={texto ?? valor}
        onBlur={() => {
          if (texto !== null) onChange(Math.max(0, Number(texto) || 0))
          setTexto(null)
        }}
        onChange={(e) => {
          setTexto(e.target.value)
          if (e.target.value.trim() !== '') onChange(Math.max(0, Number(e.target.value) || 0))
        }}
        className={
          'cifra w-full rounded-lg border border-borde py-1.5 text-[.86rem] text-right ' +
          'focus:outline-none focus:border-marca focus:ring-[3px] focus:ring-marca/12 ' +
          (prefijo ? 'pl-8 pr-2.5 ' : 'px-2.5 ') +
          (sufijo ? 'pr-7' : '')
        }
      />
      {sufijo && (
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[.78rem] text-texto-suave pointer-events-none">
          {sufijo}
        </span>
      )}
    </div>
  )
}

export default function Configurador() {
  const c = useConfig()

  return (
    <div className="min-h-dvh">
      <Encabezado />

      <main className="max-w-[1100px] mx-auto px-4 py-6 lg:py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-[.87rem] text-texto-suave hover:text-marca transition-colors mb-5"
        >
          <ArrowLeft size={16} weight="light" /> Volver a la tienda
        </Link>

        <div className="flex flex-wrap items-start gap-3 mb-6">
          <div className="flex-1 min-w-[240px]">
            <h1 className="text-[1.5rem] lg:text-[1.9rem] font-bold tracking-[-.02em]">
              Configurador del bundle
            </h1>
            <p className="text-texto-suave text-[.92rem] mt-1">
              Cambia precios, stock e hitos de descuento. La tienda lo toma al instante.
            </p>
          </div>
          {c.hayCambios && (
            <button
              onClick={c.restablecer}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-borde text-[.84rem] hover:border-marca/40 transition-colors"
            >
              <ArrowCounterClockwise size={15} weight="light" />
              Restablecer
            </button>
          )}
        </div>

        <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-marca-suave text-[.85rem] mb-6">
          <Info size={18} weight="light" className="text-marca shrink-0 mt-0.5" />
          <p>
            En el prototipo los cambios se guardan solo en este navegador. En el producto real
            viven en la base de datos y los ve cualquiera que entre a la tienda.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 mb-4 items-start">
          <section className="bg-white rounded-2xl border border-borde p-5">
            <h2 className="font-semibold text-[1.02rem] mb-1">Descuentos por cantidad</h2>
            <p className="text-[.8rem] text-texto-suave mb-4">
              Desde cuántas piezas aplica cada hito y cuánto descuenta. Por debajo del primer
              hito no hay descuento.
            </p>

            <div className="space-y-2">
              {c.tramos.map((t, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <span className="text-[.84rem] text-texto-suave shrink-0 w-10">Desde</span>
                  <Numero
                    valor={t.piezas}
                    sufijo="pz"
                    ancho="w-[86px]"
                    onChange={(n) => c.editarTramo(i, { piezas: Math.max(1, n) })}
                  />
                  <span className="text-[.84rem] text-texto-suave shrink-0">descuenta</span>
                  <Numero
                    valor={t.porcentaje}
                    sufijo="%"
                    ancho="w-[80px]"
                    onChange={(n) => c.editarTramo(i, { porcentaje: Math.min(100, n) })}
                  />
                  <label className="flex items-center gap-1.5 text-[.78rem] text-texto-suave cursor-pointer ml-auto shrink-0">
                    <input
                      type="checkbox"
                      checked={t.envioGratis}
                      onChange={(e) => c.editarTramo(i, { envioGratis: e.target.checked })}
                      className="accent-[#EC5070] w-3.5 h-3.5"
                    />
                    Envío
                  </label>
                </div>
              ))}
            </div>

            <p className="text-[.76rem] text-texto-suave mt-4 pt-3.5 border-t border-borde">
              El envío gratis va atado al hito que tenga la casilla marcada. El cliente ve los{' '}
              {c.tramos.length} hitos desde que entra, con el que ya ganó resaltado.
            </p>
          </section>

          <section className="bg-white rounded-2xl border border-borde p-5">
            <h2 className="font-semibold text-[1.02rem] mb-1">Pasos y formatos</h2>
            <p className="text-[.8rem] text-texto-suave mb-4">
              Cómo está armado el recorrido del cliente y en qué puede ir su arreglo.
            </p>

            <div className="space-y-2 mb-5">
              {[
                ['Presentación', 'Formato del arreglo y color de la cinta'],
                ['Flores y follaje', 'Lo que va dentro del arreglo'],
                ['Extras', 'Globos, chocolates, peluches y más'],
                ['Mensaje', 'Dedicatoria personalizada'],
              ].map(([nombre, ayuda], i) => (
                <div
                  key={nombre}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-borde"
                >
                  <span className="w-6 h-6 rounded-full bg-marca text-white grid place-items-center text-[.72rem] font-bold shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[.88rem] font-medium">{nombre}</p>
                    <p className="text-[.75rem] text-texto-suave">{ayuda}</p>
                  </div>
                  <Check size={15} weight="bold" className="text-exito shrink-0" />
                </div>
              ))}
            </div>

            <div className="space-y-2">
              {FORMATOS.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-borde text-[.88rem]"
                >
                  <span className="flex-1">{f.nombre}</span>
                  <span className="cifra text-texto-suave">
                    {f.precio === 0 ? 'Incluido' : '+ ' + soles(f.precio)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="bg-white rounded-2xl border border-borde p-5">
          <h2 className="font-semibold text-[1.02rem] mb-1">Material disponible</h2>
          <p className="text-[.8rem] text-texto-suave mb-4">
            El precio por unidad y cuántas quedan. Al llegar a cero, el cliente ve el material
            agotado y no lo puede agregar.
          </p>

          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-[.88rem] min-w-[320px] sm:min-w-[560px]">
              <thead>
                <tr className="text-[.72rem] uppercase tracking-[.05em] text-texto-suave">
                  <th className="text-left font-semibold pb-2.5">Material</th>
                  <th className="hidden sm:table-cell text-left font-semibold pb-2.5">Categoría</th>
                  <th className="text-right font-semibold pb-2.5 w-[102px] sm:w-[120px]">Precio</th>
                  <th className="text-right font-semibold pb-2.5 w-[78px] sm:w-[120px]">Stock</th>
                </tr>
              </thead>
              <tbody>
                {c.articulos.map((a) => (
                  <tr key={a.id} className="border-t border-borde">
                    <td className="py-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-fondo p-1 shrink-0">
                          <Pieza id={a.id} nombre={a.nombre} />
                        </div>
                        <span>{a.nombre}</span>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell py-2 text-texto-suave capitalize">{a.categoria}</td>
                    <td className="py-2 text-right">
                      <Numero
                        valor={a.precio}
                        prefijo="S/"
                        ancho="w-[86px] sm:w-[104px]"
                        onChange={(n) => c.editarArticulo(a.id, { precio: n })}
                      />
                    </td>
                    <td className="py-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {a.stock === 0 && (
                          <span className="text-[.72rem] text-texto-suave">Agotado</span>
                        )}
                        <Numero
                          valor={a.stock}
                          ancho="w-[62px] sm:w-[76px]"
                          onChange={(n) => c.editarArticulo(a.id, { stock: n })}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Link
            to="/"
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-marca text-white text-[.9rem] font-semibold hover:bg-marca-oscura transition-colors"
          >
            <Check size={16} weight="bold" />
            Ver el resultado en la tienda
          </Link>
        </section>
      </main>
    </div>
  )
}
