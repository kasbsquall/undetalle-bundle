import { useLocation, Link } from 'react-router-dom'
import { CheckCircle, Package, MapPin, CreditCard, ChatCircleText } from '@phosphor-icons/react'
import { useArreglo } from '../estado/ArregloContext'
import Encabezado from '../componentes/Encabezado'
import VistaPrevia from '../componentes/VistaPrevia'

const soles = (n: number) => 'S/ ' + n.toFixed(2)

interface Datos {
  distrito?: string
  pasarela?: string
  envio?: number
  totalFinal?: number
  formato?: string
  cinta?: string
}

export default function Gracias() {
  const { state } = useLocation()
  const d = (state ?? {}) as Datos
  const a = useArreglo()

  // Numero de pedido estable dentro de la visita, para que no cambie al
  // redibujar la pantalla.
  const pedido = 11600 + (a.totalPiezas * 7 + Math.round(a.total)) % 300

  return (
    <div className="min-h-dvh">
      <Encabezado />

      <main className="max-w-[820px] mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <CheckCircle size={62} weight="light" className="text-exito mx-auto mb-4" />
          <h1 className="text-[1.7rem] lg:text-[2.1rem] font-bold tracking-[-.02em] mb-2">
            ¡Gracias por tu compra!
          </h1>
          <p className="text-texto-suave">
            Tu pedido <span className="cifra font-semibold text-texto">#{pedido}</span> fue recibido.
            Te escribimos al WhatsApp para coordinar la entrega.
          </p>
        </div>

        <div className="grid sm:grid-cols-[260px_1fr] gap-6 bg-white rounded-2xl border border-borde p-5 lg:p-6 mb-5">
          <div>
            <VistaPrevia />
          </div>

          <div>
            <h2 className="font-semibold text-[1.02rem] mb-3.5">Tu arreglo</h2>

            <div className="space-y-1.5 text-[.88rem] mb-4">
              <div className="flex justify-between">
                <span className="text-texto-suave">
                  {d.formato ?? 'Ramo envuelto'}
                  {d.cinta ? ', cinta ' + d.cinta.toLowerCase() : ''}
                </span>
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
                <span className={'cifra ' + (d.envio === 0 ? 'text-exito font-medium' : '')}>
                  {d.envio === 0 ? 'Gratis' : soles(d.envio ?? 0)}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-baseline pt-3">
              <span className="font-semibold">Total pagado</span>
              <span className="cifra text-[1.35rem] font-bold text-marca">
                {soles(d.totalFinal ?? a.total)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <Dato icono={MapPin} titulo="Entrega" texto={d.distrito ?? 'Miraflores'} />
          <Dato icono={CreditCard} titulo="Pago" texto={d.pasarela ?? 'Mercado Pago'} />
          <Dato icono={Package} titulo="Estado" texto="Compra exitosa, en preparación" />
          <Dato
            icono={ChatCircleText}
            titulo="Dedicatoria"
            texto={a.mensaje || 'Sin mensaje'}
          />
        </div>

        <div className="text-center">
          <Link
            to="/"
            className="inline-block px-6 py-3 rounded-xl border border-borde font-medium hover:border-marca/40 transition-colors"
          >
            Armar otro arreglo
          </Link>
        </div>

        <p className="mt-10 text-center text-[.78rem] text-texto-suave">
          Prototipo de demostración. No se realizó ningún cobro.
        </p>
      </main>
    </div>
  )
}

function Dato({
  icono: Icono,
  titulo,
  texto,
}: {
  icono: typeof MapPin
  titulo: string
  texto: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-borde p-4 flex gap-3">
      <Icono size={20} weight="light" className="text-marca shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p className="text-[.72rem] uppercase tracking-[.06em] text-texto-suave font-semibold">
          {titulo}
        </p>
        <p className="text-[.9rem] mt-0.5 break-words">{texto}</p>
      </div>
    </div>
  )
}
