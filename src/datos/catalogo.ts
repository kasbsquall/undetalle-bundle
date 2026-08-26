/**
 * Catalogo del prototipo.
 *
 * En el producto real esto sale de WooCommerce. Aqui vive en un archivo para
 * que el prototipo funcione sin base de datos y se pueda publicar como sitio
 * estatico. La forma de los datos es la misma que tendra despues, asi que al
 * conectarlo solo cambia de donde se leen.
 */

export type Categoria = 'flor' | 'follaje' | 'extra'

export interface Articulo {
  id: string
  nombre: string
  descripcion: string
  precio: number
  categoria: Categoria
  /** Miniatura para la tarjeta del catalogo. */
  foto: string
  /** Recorte sin fondo que cae dentro del arreglo en la vista previa. */
  pieza: string
  /** Cuanto ocupa dentro del arreglo, para que no todo se dibuje igual. */
  escala: number
}

export interface Formato {
  id: string
  nombre: string
  descripcion: string
  precio: number
  imagen: string
}

export interface Cinta {
  id: string
  nombre: string
  color: string
}

export interface TramoDescuento {
  desde: number
  hasta: number | null
  porcentaje: number
}

export const ENVIO_GRATIS_DESDE = 80

export const TRAMOS: TramoDescuento[] = [
  { desde: 0, hasta: 59.99, porcentaje: 0 },
  { desde: 60, hasta: 99.99, porcentaje: 5 },
  { desde: 100, hasta: 149.99, porcentaje: 10 },
  { desde: 150, hasta: null, porcentaje: 15 },
]

export const FORMATOS: Formato[] = [
  {
    id: 'ramo',
    nombre: 'Ramo envuelto',
    descripcion: 'Clasico, en papel coreano',
    precio: 0,
    imagen: 'ramo',
  },
  {
    id: 'caja',
    nombre: 'Caja redonda',
    descripcion: 'Elegante, lista para regalar',
    precio: 15,
    imagen: 'caja',
  },
  {
    id: 'florero',
    nombre: 'Florero de vidrio',
    descripcion: 'Para que duren en casa',
    precio: 25,
    imagen: 'florero',
  },
]

export const CINTAS: Cinta[] = [
  { id: 'rosa', nombre: 'Rosa', color: '#EC5070' },
  { id: 'crema', nombre: 'Crema', color: '#EADFCF' },
  { id: 'vino', nombre: 'Vino', color: '#7B2233' },
  { id: 'blanco', nombre: 'Blanco', color: '#F7F5F2' },
  { id: 'verde', nombre: 'Verde', color: '#5C7A5C' },
]

export const ARTICULOS: Articulo[] = [
  { id: 'rosa-roja',    nombre: 'Rosas rojas',      descripcion: 'Clasicas y elegantes',   precio: 6, categoria: 'flor',    foto: 'rosa-roja',    pieza: 'rosa-roja',    escala: 1 },
  { id: 'rosa-rosada',  nombre: 'Rosas rosadas',    descripcion: 'Romanticas y dulces',    precio: 6, categoria: 'flor',    foto: 'rosa-rosada',  pieza: 'rosa-rosada',  escala: 1 },
  { id: 'lirio',        nombre: 'Lirios blancos',   descripcion: 'Elegancia y pureza',     precio: 7, categoria: 'flor',    foto: 'lirio',        pieza: 'lirio',        escala: 1.15 },
  { id: 'girasol',      nombre: 'Girasoles',        descripcion: 'Alegria y energia',      precio: 6, categoria: 'flor',    foto: 'girasol',      pieza: 'girasol',      escala: 1.2 },
  { id: 'tulipan',      nombre: 'Tulipanes',        descripcion: 'Color y ternura',        precio: 6, categoria: 'flor',    foto: 'tulipan',      pieza: 'tulipan',      escala: 0.95 },
  { id: 'gerbera',      nombre: 'Gerberas',         descripcion: 'Frescura y vitalidad',   precio: 5, categoria: 'flor',    foto: 'gerbera',      pieza: 'gerbera',      escala: 1 },
  { id: 'clavel',       nombre: 'Claveles',         descripcion: 'Belleza duradera',       precio: 4, categoria: 'flor',    foto: 'clavel',       pieza: 'clavel',       escala: 0.9 },
  { id: 'hortensia',    nombre: 'Hortensias',       descripcion: 'Volumen y delicadeza',   precio: 7, categoria: 'flor',    foto: 'hortensia',    pieza: 'hortensia',    escala: 1.3 },

  { id: 'eucalipto',    nombre: 'Follaje eucalipto', descripcion: 'Verde y aromatico',     precio: 4, categoria: 'follaje', foto: 'eucalipto',    pieza: 'eucalipto',    escala: 1.25 },
  { id: 'helecho',      nombre: 'Helecho',           descripcion: 'Textura y volumen',     precio: 3, categoria: 'follaje', foto: 'helecho',      pieza: 'helecho',      escala: 1.2 },
  { id: 'gypsophila',   nombre: 'Gypsophila',        descripcion: 'Nube de flores blancas', precio: 4, categoria: 'follaje', foto: 'gypsophila',  pieza: 'gypsophila',   escala: 1.1 },

  { id: 'globo',        nombre: 'Globo metalico',    descripcion: 'Para ocasiones especiales', precio: 12, categoria: 'extra', foto: 'globo',     pieza: 'globo',        escala: 1.1 },
  { id: 'chocolates',   nombre: 'Caja de chocolates', descripcion: 'Bombones surtidos',    precio: 25, categoria: 'extra',  foto: 'chocolates',   pieza: 'chocolates',   escala: 1 },
  { id: 'peluche',      nombre: 'Peluche',            descripcion: 'Oso de 25 cm',         precio: 30, categoria: 'extra',  foto: 'peluche',      pieza: 'peluche',      escala: 1.15 },
  { id: 'vino-tinto',   nombre: 'Vino tinto',         descripcion: 'Botella 750 ml',       precio: 45, categoria: 'extra',  foto: 'vino',         pieza: 'vino',         escala: 1.1 },
]

export function tramoPara(subtotal: number): TramoDescuento {
  for (const t of TRAMOS) {
    if (subtotal >= t.desde && (t.hasta === null || subtotal <= t.hasta)) return t
  }
  return TRAMOS[0]
}

/** El siguiente tramo al que puede llegar, para decirle cuanto le falta. */
export function siguienteTramo(subtotal: number): TramoDescuento | null {
  return TRAMOS.find((t) => t.desde > subtotal) ?? null
}
