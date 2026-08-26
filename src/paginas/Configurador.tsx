import { Link } from 'react-router-dom'
import { ArrowLeft, Info } from '@phosphor-icons/react'
import { ARTICULOS, FORMATOS, TRAMOS, ENVIO_GRATIS_DESDE } from '../datos/catalogo'
import Encabezado from '../componentes/Encabezado'

const soles = (n: number) => 'S/ ' + n.toFixed(2)

/**
 * La pantalla que responde la pregunta de Wilson: esto lo cargo yo.
 *
 * En el prototipo solo muestra la configuracion, no la guarda. En el producto
 * real vive dentro del panel de WordPress y cada campo es editable, con el
 * control de stock que aqui todavia no existe.
 */
export default function Configurador() {
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

        <div className="flex items-start gap-3 mb-6">
          <div>
            <h1 className="text-[1.5rem] lg:text-[1.9rem] font-bold tracking-[-.02em]">
              Configurador del bundle
            </h1>
            <p className="text-texto-suave text-[.92rem] mt-1">
              Así se administra desde el panel: los tramos, los formatos y el material disponible.
            </p>
          </div>
          <span className="ml-auto shrink-0 px-3 py-1.5 rounded-full bg-exito-suave text-exito text-[.78rem] font-semibold">
            Activo
          </span>
        </div>

        <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-marca-suave text-[.85rem] mb-6">
          <Info size={18} weight="light" className="text-marca shrink-0 mt-0.5" />
          <p>
            En el prototipo esta pantalla es solo de lectura. En la versión final cada campo se
            edita y se guarda, y el catálogo sale de los productos de la tienda.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 mb-4">
          <section className="bg-white rounded-2xl border border-borde p-5">
            <h2 className="font-semibold text-[1.02rem] mb-4">Reglas de descuento por monto</h2>
            <div className="rounded-xl border border-borde overflow-hidden">
              <div className="grid grid-cols-2 px-4 py-2 bg-fondo text-[.75rem] font-semibold uppercase tracking-[.05em] text-texto-suave">
                <span>Rango de compra</span>
                <span className="text-right">Descuento</span>
              </div>
              {TRAMOS.map((t) => (
                <div key={t.desde} className="grid grid-cols-2 px-4 py-2.5 border-t border-borde text-[.88rem]">
                  <span className="cifra">
                    {t.hasta === null ? 'S/ ' + t.desde + ' o más' : 'S/ ' + t.desde + ' - S/ ' + t.hasta}
                  </span>
                  <span className="cifra text-right font-semibold">{t.porcentaje}%</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between px-4 py-3 rounded-xl bg-fondo text-[.88rem]">
              <span className="text-texto-suave">Envío gratis desde</span>
              <span className="cifra font-semibold">{soles(ENVIO_GRATIS_DESDE)}</span>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-borde p-5">
            <h2 className="font-semibold text-[1.02rem] mb-4">Pasos del bundle</h2>
            <div className="space-y-2">
              {[
                ['Presentación', 'Formato del arreglo y color de la cinta'],
                ['Flores y follaje', 'Lo que va dentro del arreglo'],
                ['Extras', 'Globos, chocolates, peluches y más'],
                ['Mensaje', 'Dedicatoria personalizada'],
              ].map(([nombre, ayuda], i) => (
                <div key={nombre} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-borde">
                  <span className="w-6 h-6 rounded-full bg-marca text-white grid place-items-center text-[.72rem] font-bold shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[.89rem] font-medium">{nombre}</p>
                    <p className="text-[.76rem] text-texto-suave">{ayuda}</p>
                  </div>
                  <span className="w-9 h-5 rounded-full bg-exito relative shrink-0">
                    <span className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white" />
                  </span>
                </div>
              ))}
            </div>

            <h2 className="font-semibold text-[1.02rem] mt-6 mb-3">Formatos disponibles</h2>
            <div className="space-y-2">
              {FORMATOS.map((f) => (
                <div key={f.id} className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-borde text-[.88rem]">
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
          <h2 className="font-semibold text-[1.02rem] mb-4">Material disponible en el bundle</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-[.88rem] min-w-[440px]">
              <thead>
                <tr className="text-[.74rem] uppercase tracking-[.05em] text-texto-suave">
                  <th className="text-left font-semibold pb-2.5">Producto</th>
                  <th className="text-left font-semibold pb-2.5">Categoría</th>
                  <th className="text-right font-semibold pb-2.5">Precio</th>
                  <th className="text-right font-semibold pb-2.5">Stock</th>
                </tr>
              </thead>
              <tbody>
                {ARTICULOS.map((a) => (
                  <tr key={a.id} className="border-t border-borde">
                    <td className="py-2.5">{a.nombre}</td>
                    <td className="py-2.5 text-texto-suave capitalize">{a.categoria}</td>
                    <td className="py-2.5 text-right cifra">{soles(a.precio)}</td>
                    <td className="py-2.5 text-right text-texto-suave">Sin control</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-[.8rem] text-texto-suave">
            El control de stock por material es de las cosas que faltan y que conviene resolver
            antes de salir en vivo: si el material es sobrante, es limitado por definición.
          </p>
        </section>
      </main>
    </div>
  )
}
