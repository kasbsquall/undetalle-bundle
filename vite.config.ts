import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// El sitio se publica en GitHub Pages bajo /undetalle-bundle/, asi que las
// rutas de los recursos tienen que salir con ese prefijo. En local queda en /.
export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  base: command === 'build' ? '/undetalle-bundle/' : '/',
}))
