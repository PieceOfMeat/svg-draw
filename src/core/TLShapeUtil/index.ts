import type { TLShape } from '../types'
import type { TLShapeUtil } from './TLShapeUtil'

export type TLShapeUtilsMap<T extends TLShape> = {
  [K in T['type']]: TLShapeUtil<T>
}

export * from './TLShapeUtil'
