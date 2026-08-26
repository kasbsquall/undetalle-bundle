# Arma tu arreglo · prototipo

Prototipo funcional del sistema de bundle para Undetalle: el cliente arma su
propio arreglo floral eligiendo formato, flores, follaje y extras, y gana
descuento según cuántas piezas junta.

Sirve para enseñar el recorrido completo. El cobro es simulado y la
configuración se guarda solo en el navegador de quien la cambia.

## Qué incluye

- Cuatro pasos: presentación, flores y follaje, extras y mensaje
- Hitos de descuento por cantidad: 3 piezas 5%, 5 piezas 10%, 8 piezas 15% y
  10 piezas 20% con envío gratis
- Resumen en vivo con la foto de cada material elegido
- Control de stock por material, con aviso de últimas unidades y agotado
- Checkout simulado que representa el que ya tiene la tienda
- Página de agradecimiento con el pedido completo
- Pantalla de configuración con precios, stock e hitos editables

## Para correrlo en local

```
npm install
npm run dev
```

## Publicación

Cada envío a `master` se publica solo en GitHub Pages.
