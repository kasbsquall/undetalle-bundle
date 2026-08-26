import { Link } from 'react-router-dom'
import { ShieldCheck, Sliders } from '@phosphor-icons/react'

export default function Encabezado() {
  return (
    <header className="sticky top-0 z-[60] bg-white/95 backdrop-blur border-b border-borde">
      <div className="max-w-[1240px] mx-auto px-4 h-16 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-marca grid place-items-center shrink-0">
            <span className="text-white font-bold text-[.95rem]">u</span>
          </span>
          <span className="font-bold tracking-[-.02em] leading-none">
            undetalle
            <span className="block text-[.62rem] font-normal text-texto-suave tracking-[.14em] mt-0.5">
              ARMA TU ARREGLO
            </span>
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/configurador"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-[.8rem] text-texto-suave hover:text-marca transition-colors"
            title="Pantalla de administración del bundle"
          >
            <Sliders size={16} weight="light" />
            Configurador
          </Link>
          <span className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-exito-suave text-exito text-[.78rem] font-medium">
            <ShieldCheck size={15} weight="light" />
            Pago seguro
          </span>
        </div>
      </div>
    </header>
  )
}
