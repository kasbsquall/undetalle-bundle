import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ProveedorConfig } from './estado/ConfigContext'
import { ProveedorArreglo } from './estado/ArregloContext'
import Constructor from './paginas/Constructor'
import Checkout from './paginas/Checkout'
import Gracias from './paginas/Gracias'
import Configurador from './paginas/Configurador'

/**
 * Al cambiar de pantalla el navegador conserva la posicion del scroll, que en
 * una sola pagina significa aterrizar a media altura. Quien terminaba de pagar
 * caia en la pantalla de gracias con el titulo tapado por la cabecera.
 */
function SubirAlCambiarDePantalla() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <ProveedorConfig>
      <ProveedorArreglo>
        <SubirAlCambiarDePantalla />
        <Routes>
          <Route path="/" element={<Constructor />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/gracias" element={<Gracias />} />
          <Route path="/configurador" element={<Configurador />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ProveedorArreglo>
    </ProveedorConfig>
  )
}
