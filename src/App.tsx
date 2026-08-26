import { Routes, Route, Navigate } from 'react-router-dom'
import { ProveedorConfig } from './estado/ConfigContext'
import { ProveedorArreglo } from './estado/ArregloContext'
import Constructor from './paginas/Constructor'
import Checkout from './paginas/Checkout'
import Gracias from './paginas/Gracias'
import Configurador from './paginas/Configurador'

export default function App() {
  return (
    <ProveedorConfig>
      <ProveedorArreglo>
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
