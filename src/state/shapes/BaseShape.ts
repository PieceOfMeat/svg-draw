import { immerable, produce } from 'immer'
import { getBoundsCenter, normalizedAngle, snapAngleToSegments, uniqueId } from 'utils'
import { snap } from 'utils/vec'
import type { TLBounds, TLEntity, TLHandle, TLShape } from 'core'
import type { Moveable, Optional, TDShape, TDShapeStyle, TDShapeStyleKeys } from 'types'
import { DEFAULT_STYLES } from 'types'

export interface BaseEntity extends TLEntity {
  styles: Partial<TDShapeStyle>
}

export type BaseShapeCreateProps =
  Optional<BaseEntity, 'id' | 'type' | 'childIndex' | 'rotation' | 'styles'>

abstract class BaseShape implements TLShape, Moveable, BaseEntity {
  [immerable] = true

  id: string

  // Gets defined in ancestors
  type!: string

  childIndex: number

  point: number[]

  rotation: number

  handles?: Record<string, TLHandle>

  styleProps!: TDShapeStyleKeys

  styles: Partial<TDShapeStyle> = {}

  protected constructor(shape: BaseShapeCreateProps) {
    this.id = shape.id || uniqueId()
    this.childIndex = shape.childIndex || 0
    this.point = shape.point
    this.rotation = shape.rotation ? shape.rotation : 0
  }

  abstract getBounds(): TLBounds

  produce(patch: Partial<TDShape>) {
    return produce(this, draft => Object.assign(draft, patch))
  }

  initStyles(styles: Partial<TDShapeStyle> = DEFAULT_STYLES) {
    if (!this.styleProps) return
    this.styleProps.forEach((prop) => {
      // @ts-ignore
      this.styles[prop] = styles[prop]
    })
  }

  setStyles(styles: Partial<TDShapeStyle>): this {
    if (!this.styleProps) return this
    return produce(this, (draft: BaseShape) => {
      draft.styleProps.forEach((prop) => {
        // @ts-ignore
        draft.styles[prop] = styles[prop]
      })
    })
  }

  translate(newPoint: number[], grid = 1) {
    return this.produce({
      point: grid === 1 ? newPoint : snap(newPoint, grid),
    })
  }

  rotate(point: number[], snapToAngle = false) {
    const center = getBoundsCenter(this.getBounds())
    const newAngle = normalizedAngle(center, point)
    const rotation = snapToAngle
      ? snapAngleToSegments(newAngle, 24)
      : newAngle

    return this.produce({ rotation })
  }

  getHandle(handleKey: string) {
    if (!this.handles || !(handleKey in this.handles)) return undefined
    return this.handles[handleKey]
  }

  getEntity() {
    return {
      id: this.id,
      type: this.type,
      childIndex: this.childIndex,
      point: this.point,
      rotation: this.rotation,
      styles: this.styles,
    } as BaseEntity
  }
}

export default BaseShape
