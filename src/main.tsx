import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './estilos.css'

/*
 * Se usa HashRouter y no BrowserRouter porque el prototipo se publica en
 * GitHub Pages, que sirve archivos estaticos y no sabe reescribir rutas. Con
 * rutas normales, recargar en /checkout daria un 404.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
