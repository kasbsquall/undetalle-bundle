import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ShieldCheck, Truck, CheckCircle } from '@phosphor-icons/react'
import { useArreglo } from '../estado/ArregloContext'
import { FORMATOS, CINTAS, ENVIO_GRATIS_DESDE } from '../datos/catalogo'
import Encabezado from '../componentes/Encabezado'
import VistaPrevia from '../componentes/VistaPrevia'

const soles = (n: number) => 'S/ ' + n.toFixed(2)

/*
 * Las mismas pasarelas que tiene el checkout real de Undetalle, en el mismo
 * orden. Aqui son solo visuales: el prototipo no cobra nada y siempre termina
 * bien. Es para que Wilson vea el recorrido completo, no para procesar pagos.
 */
const PASARELAS = [
  { id: 'mercadopago', nombre: 'Mercado Pago', sello: 'Más rápido' },
  { id: 'culqi', nombre: 'Culqi', sello: null },
  { id: 'yape', nombre: 'Yape', sello: null },
  { id: 'plin', nombre: 'Plin', sello: null },
  { id: 'transferencia', nombre: 'Transferencia bancaria', sello: null },
  { id: 'paypal', nombre: 'PayPal', sello: null },
]

const DISTRITOS = [
  { nombre: 'Miraflores', envio: 20 },
  { nombre: 'San Isidro', envio: 20 },
  { nombre: 'Jesús María', envio: 20 },
  { nombre: 'San Borja', envio: 20 },
  { nombre: 'Surco - Monterrico', envio: 25 },
  { nombre: 'La Molina', envio: 30 },
  { nombre: 'Callao', envio: 35 },
]

export default function Checkout() {
  const a = useArreglo()
  const navegar = useNavigate()
  const [distrito, setDistrito] = useState(DISTRITOS[0].nombre)
  const [pasarela, setPasarela] = useState(PASARELAS[0].id)
  const [acepta, setAcepta] = useState(false)
  const [procesando, setProcesando] = useState(false)

  const formato = FORMATOS.find((f) => f.id === a.formatoId) ?? FORMATOS[0]
  const cinta = CINTAS.find((c) => c.id === a.cintaId) ?? CINTAS[0]
  const zona = DISTRITOS.find((d) => d.nombre === distrito) ?? DISTRITOS[0]
  const envio = a.llevaEnvioGratis ? 0 : zona.envio
  const totalFinal = +(a.total + envio).toFixed(2)

  const pagar = () => {
    setProcesando(true)
    // Se simula la espera de la pasarela para que el recorrido se sienta real.
    setTimeout(() => {
      navegar('/gracias', {
        state: {
          distrito,
          pasarela: PASARELAS.find((p) => p.id === pasarela)?.nombre,
          envio,
          totalFinal,
          formato: formato.nombre,
          cinta: cinta.nombre,
        },
      })
    }, 1400)
  }

  if (a.totalPiezas === 0) {
    return (
      <div className="min-h-dvh">
        <Encabezado />
        <div className="max-w-[560px] mx-auto px-4 py-20 text-center">
          <h1 className="text-[1.4rem] font-bold mb-2">Tu arreglo está vacío</h1>
          <p className="text-texto-suave mb-6">Arma tu arreglo antes de continuar al pago.</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 rounded-xl bg-marca text-white font-semibold hover:bg-marca-oscura transition-colors"
          >
            Armar mi arreglo
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh">
      <Encabezado />

      <main className="max-w-[1240px] mx-auto px-4 py-6 lg:py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-[.87rem] text-texto-suave hover:text-marca transition-colors mb-5"
        >
          <ArrowLeft size={16} weight="light" /> Seguir editando mi arreglo
        </Link>

        <h1 className="text-[1.6rem] lg:text-[2rem] font-bold tracking-[-.02em] mb-6">
          Finalizar compra
        </h1>

        <div className="grid lg:grid-cols-[1fr_400px] gap-6 items-start">
          <div className="space-y-4">
            <section className="bg-white rounded-2xl border border-borde p-5">
              <h2 className="font-semibold text-[1.02rem] mb-4">¿A dónde lo enviamos?</h2>
              <div className="grid sm:grid-cols-2 gap-3.5">
                <Campo etiqueta="Nombre de quien recibe" valor="Andrea Rico" />
                <Campo etiqueta="Celular" valor="965 435 823" />
                <div className="sm:col-span-2">
                  <label htmlFor="distrito" className="block text-[.84rem] font-medium mb-1.5">
                    Distrito
                  </label>
                  <select
                    id="distrito"
                    value={distrito}
                    onChange={(e) => setDistrito(e.target.value)}
                    className="w-full rounded-xl border border-borde px-3.5 py-2.5 text-[.92rem] bg-white focus:outline-none focus:border-marca"
                  >
                    {DISTRITOS.map((d) => (
                      <option key={d.nombre} value={d.nombre}>
                        {d.nombre} · envío {soles(d.envio)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <Campo etiqueta="Dirección" valor="Av. San Felipe 1140" />
                </div>
              </div>

              <div
                className={
                  'mt-4 flex items-center gap-2.5 px-4 py-3 rounded-xl text-[.86rem] ' +
                  (a.llevaEnvioGratis ? 'bg-exito-suave text-exito' : 'bg-fondo text-texto-suave')
                }
              >
                <Truck size={18} weight="light" className="shrink-0" />
                {a.llevaEnvioGratis
                  ? 'Tu compra supera S/ ' + ENVIO_GRATIS_DESDE + ', el envío va gratis'
                  : 'Envío a ' + zona.nombre + ': ' + soles(zona.envio) + '. Gratis desde S/ ' + ENVIO_GRATIS_DESDE}
              </div>
            </section>

            <section className="bg-white rounded-2xl border border-borde p-5">
              <h2 className="font-semibold text-[1.02rem] mb-4">Método de pago</h2>
              <div className="space-y-2">
                {PASARELAS.map((p) => {
                  const activo = pasarela === p.id
                  return (
                    <label
                      key={p.id}
                      className={
                        'flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ' +
                        (activo ? 'border-marca bg-marca-suave' : 'border-borde hover:border-marca/40')
                      }
                    >
                      <input
                        type="radio"
                        name="pasarela"
                        checked={activo}
                        onChange={() => setPasarela(p.id)}
                        className="accent-[#EC5070]"
                      />
                      <span className="flex-1 text-[.92rem] font-medium">{p.nombre}</span>
                      {p.sello && (
                        <span className="text-[.7rem] font-semibold px-2 py-1 rounded-md bg-marca text-white">
                          {p.sello}
                        </span>
                      )}
                    </label>
                  )
                })}
              </div>
              <p className="mt-3 text-[.76rem] text-texto-suave">
                En esta demostración no se realiza ningún cobro real.
              </p>
            </section>
          </div>

          <aside className="lg:sticky lg:top-5 space-y-4">
            <div className="bg-white rounded-2xl border border-borde p-5">
              <h2 className="font-semibold text-[1.02rem] mb-3.5">Tu pedido</h2>

              <div className="mb-4">
                <VistaPrevia />
              </div>

              <div className="space-y-1.5 text-[.86rem] mb-3">
                <div className="flex justify-between">
                  <span className="text-texto-suave">{formato.nombre}, cinta {cinta.nombre.toLowerCase()}</span>
                  <span className="cifra">{formato.precio === 0 ? '—' : soles(formato.precio)}</span>
                </div>
                {a.lineas.map(({ articulo, cantidad }) => (
                  <div key={articulo.id} className="flex justify-between">
                    <span className="text-texto-suave">
                      {articulo.nombre} <span className="cifra">×{cantidad}</span>
                    </span>
                    <span className="cifra">{soles(articulo.precio * cantidad)}</span>
                  </div>
                ))}
              </div>

              {a.mensaje && (
                <p className="text-[.8rem] text-texto-suave italic border-l-2 border-borde pl-3 mb-3">
                  “{a.mensaje}”
                </p>
              )}

              <div className="space-y-1.5 text-[.88rem] py-3 border-y border-borde">
                <div className="flex justify-between">
                  <span className="text-texto-suave">Subtotal</span>
                  <span className="cifra">{soles(a.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-texto-suave">Descuento ({a.porcentaje}%)</span>
                  <span className="cifra text-marca">− {soles(a.descuento)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-texto-suave">Envío</span>
                  <span className={'cifra ' + (envio === 0 ? 'text-exito font-medium' : '')}>
                    {envio === 0 ? 'Gratis' : soles(envio)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-baseline pt-3 mb-4">
                <span className="font-semibold">Total</span>
                <span className="cifra text-[1.45rem] font-bold text-marca">{soles(totalFinal)}</span>
              </div>

              <label className="flex items-start gap-2.5 mb-3.5 text-[.83rem] cursor-pointer">
                <input
                  type="checkbox"
                  checked={acepta}
                  onChange={(e) => setAcepta(e.target.checked)}
                  className="mt-0.5 accent-[#EC5070]"
                />
                <span>
                  He leído y acepto los <span className="text-marca">términos y condiciones</span> de la web
                </span>
              </label>

              <button
                onClick={pagar}
                disabled={!acepta || procesando}
                className={
                  'w-full py-3.5 rounded-xl font-semibold transition-all ' +
                  (!acepta || procesando
                    ? 'bg-borde text-texto-suave cursor-not-allowed'
                    : 'bg-marca text-white hover:bg-marca-oscura active:scale-[.99]')
                }
              >
                {procesando ? 'Procesando…' : 'Pagar ' + soles(totalFinal)}
              </button>

              <p className="mt-2.5 flex items-center justify-center gap-1.5 text-[.79rem] text-texto-suave">
                <ShieldCheck size={15} weight="light" className="text-exito" />
                Pago 100% seguro, datos protegidos con SSL
              </p>
            </div>
          </aside>
        </div>
      </main>

      {procesando && (
        <div className="fixed inset-0 z-[80] bg-black/45 grid place-items-center px-4">
          <div className="bg-white rounded-2xl p-8 text-center max-w-[320px] w-full">
            <CheckCircle size={44} weight="light" className="text-marca mx-auto mb-3 animate-pulse" />
            <p className="font-semibold mb-1">Procesando tu pago</p>
            <p className="text-[.85rem] text-texto-suave">Un momento, por favor</p>
          </div>
        </div>
      )}
    </div>
  )
}

function Campo({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div>
      <label className="block text-[.84rem] font-medium mb-1.5">{etiqueta}</label>
      <input
        defaultValue={valor}
        className="w-full rounded-xl border border-borde px-3.5 py-2.5 text-[.92rem] focus:outline-none focus:border-marca"
      />
    </div>
  )
}
