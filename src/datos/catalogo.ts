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
  /** Unidades disponibles. El material del bundle es sobrante, o sea limitado. */
  stock: number
}

export interface Formato {
  id: string
  nombre: string
  descripcion: string
  precio: number
}

export interface Cinta {
  id: string
  nombre: string
  color: string
}

/**
 * El descuento se calcula sobre la cantidad de piezas.
 *
 * Asi el cliente sabe cuanto le falta contando flores, que es algo que ya tiene
 * delante. Calculado sobre el monto tenia que hacer una cuenta mental para
 * saber si le faltaba poco o mucho.
 */
export interface TramoDescuento {
  /** Desde cuantas piezas aplica. */
  piezas: number
  porcentaje: number
  envioGratis: boolean
}

export const TRAMOS: TramoDescuento[] = [
  { piezas: 3, porcentaje: 5, envioGratis: false },
  { piezas: 5, porcentaje: 10, envioGratis: false },
  { piezas: 8, porcentaje: 15, envioGratis: false },
  { piezas: 10, porcentaje: 20, envioGratis: true },
]

export const FORMATOS: Formato[] = [
  {
    id: 'ramo',
    nombre: 'Ramo envuelto',
    descripcion: 'Clásico, en papel coreano',
    precio: 0,
  },
  {
    id: 'caja',
    nombre: 'Caja redonda',
    descripcion: 'Elegante, lista para regalar',
    precio: 15,
  },
  {
    id: 'florero',
    nombre: 'Florero de vidrio',
    descripcion: 'Para que duren en casa',
    precio: 25,
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
  { id: 'rosa-roja',    nombre: 'Rosas rojas',      descripcion: 'Clásicas y elegantes',   precio: 6, categoria: 'flor', stock: 24 },
  { id: 'rosa-rosada',  nombre: 'Rosas rosadas',    descripcion: 'Románticas y dulces',    precio: 6, categoria: 'flor', stock: 18 },
  { id: 'lirio',        nombre: 'Lirios blancos',   descripcion: 'Elegancia y pureza',     precio: 7, categoria: 'flor', stock: 9 },
  { id: 'girasol',      nombre: 'Girasoles',        descripcion: 'Alegría y energía',      precio: 6, categoria: 'flor', stock: 12 },
  { id: 'tulipan',      nombre: 'Tulipanes',        descripcion: 'Color y ternura',        precio: 6, categoria: 'flor', stock: 15 },
  { id: 'gerbera',      nombre: 'Gerberas',         descripcion: 'Frescura y vitalidad',   precio: 5, categoria: 'flor', stock: 20 },
  { id: 'clavel',       nombre: 'Claveles',         descripcion: 'Belleza duradera',       precio: 4, categoria: 'flor', stock: 30 },
  { id: 'hortensia',    nombre: 'Hortensias',       descripcion: 'Volumen y delicadeza',   precio: 7, categoria: 'flor', stock: 6 },

  { id: 'eucalipto',    nombre: 'Follaje eucalipto', descripcion: 'Verde y aromático',     precio: 4, categoria: 'follaje', stock: 25 },
  { id: 'helecho',      nombre: 'Helecho',           descripcion: 'Textura y volumen',     precio: 3, categoria: 'follaje', stock: 14 },
  { id: 'gypsophila',   nombre: 'Gypsophila',        descripcion: 'Nube de flores blancas', precio: 4, categoria: 'follaje', stock: 16 },

  { id: 'globo',        nombre: 'Globo metálico',    descripcion: 'Para ocasiones especiales', precio: 12, categoria: 'extra', stock: 8 },
  { id: 'chocolates',   nombre: 'Caja de chocolates', descripcion: 'Bombones surtidos',    precio: 25, categoria: 'extra', stock: 5 },
  { id: 'peluche',      nombre: 'Peluche',            descripcion: 'Oso de 25 cm',         precio: 30, categoria: 'extra', stock: 3 },
  { id: 'vino-tinto',   nombre: 'Vino tinto',         descripcion: 'Botella 750 ml',       precio: 45, categoria: 'extra', stock: 4 },
]

/** El mejor tramo alcanzado. Null mientras no llegue ni al primero. */
export function tramoPara(piezas: number, tramos: TramoDescuento[] = TRAMOS): TramoDescuento | null {
  let alcanzado: TramoDescuento | null = null
  for (const t of tramos) {
    if (piezas >= t.piezas) alcanzado = t
  }
  return alcanzado
}

/** El siguiente hito, para decirle cuantas piezas le faltan. */
export function siguienteTramo(piezas: number, tramos: TramoDescuento[] = TRAMOS): TramoDescuento | null {
  return tramos.find((t) => t.piezas > piezas) ?? null
}
