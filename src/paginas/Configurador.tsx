import { Link } from 'react-router-dom'
import { ArrowLeft, Info, ArrowCounterClockwise, Check } from '@phosphor-icons/react'
import { FORMATOS } from '../datos/catalogo'
import { useConfig } from '../estado/ConfigContext'
import Encabezado from '../componentes/Encabezado'
import Pieza from '../componentes/Pieza'

const soles = (n: number) => 'S/ ' + n.toFixed(2)

/**
 * La pantalla que responde la pregunta de Wilson: esto lo cargo yo.
 *
 * Es editable de verdad, no una maqueta: lo que se cambia aqui se ve en la
 * tienda al instante. En el prototipo se guarda en el navegador; en el producto
 * real vive en la base de datos y esta pantalla es la del panel de WordPress.
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
        value={valor}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
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
              Cambia precios, stock y descuentos. La tienda lo toma al instante.
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
            <h2 className="font-semibold text-[1.02rem] mb-1">Descuentos por monto</h2>
            <p className="text-[.8rem] text-texto-suave mb-4">
              Desde qué monto aplica cada tramo y cuánto descuenta. Debajo del primer tramo no
              hay descuento.
            </p>

            <div className="space-y-2">
              {c.tramos.map((t, i) =>
                // El primer tramo es el suelo: empieza en cero y no descuenta.
                // Ponerlo como campo editable solo invita a romper la escalera.
                i === 0 ? null : (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="text-[.84rem] text-texto-suave shrink-0">Desde</span>
                    <Numero
                      valor={t.desde}
                      prefijo="S/"
                      onChange={(n) => c.editarTramo(i, { desde: n })}
                    />
                    <span className="cifra text-[.78rem] text-texto-suave shrink-0">
                      {t.hasta === null ? 'a más' : 'a ' + soles(t.hasta)}
                    </span>
                    <Numero
                      valor={t.porcentaje}
                      sufijo="%"
                      ancho="w-[86px]"
                      onChange={(n) => c.editarTramo(i, { porcentaje: Math.min(100, n) })}
                    />
                  </div>
                ),
              )}
            </div>

            <div className="flex items-center gap-2.5 mt-5 pt-4 border-t border-borde">
              <span className="text-[.84rem] flex-1">Envío gratis desde</span>
              <Numero valor={c.envioGratisDesde} prefijo="S/" onChange={c.setEnvioGratisDesde} />
            </div>
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
            <table className="w-full text-[.88rem] min-w-[560px]">
              <thead>
                <tr className="text-[.72rem] uppercase tracking-[.05em] text-texto-suave">
                  <th className="text-left font-semibold pb-2.5">Material</th>
                  <th className="text-left font-semibold pb-2.5">Categoría</th>
                  <th className="text-right font-semibold pb-2.5 w-[120px]">Precio</th>
                  <th className="text-right font-semibold pb-2.5 w-[120px]">Stock</th>
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
                    <td className="py-2 text-texto-suave capitalize">{a.categoria}</td>
                    <td className="py-2 text-right">
                      <Numero
                        valor={a.precio}
                        prefijo="S/"
                        ancho="w-[104px]"
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
                          ancho="w-[76px]"
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
