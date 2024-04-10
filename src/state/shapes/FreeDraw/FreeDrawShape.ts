import { produce } from 'immer'
import { TDShapeStyle, TDShapeStyleKeys, TDShapeType, Transformable, TransformedBounds } from 'types'
import BaseShape, { BaseEntity, BaseShapeCreateProps } from 'state/shapes/BaseShape'
import { getBoundsFromPoints, translateBounds, translatePoints } from 'utils'
import { isEqual, sub, toFixed } from 'utils/vec'

type FreeDrawShapeStyles = Pick<TDShapeStyle, 'color' | 'size'>

export interface FreeDrawEntity extends BaseEntity {
  type: TDShapeType.FreeDraw,
  points: number[][]
  styles: FreeDrawShapeStyles
}

interface FreeDrawShapeCreateProps extends BaseShapeCreateProps {
  points?: number[][]
}

class FreeDrawShape extends BaseShape implements FreeDrawEntity, Transformable {
  type = TDShapeType.FreeDraw as const

  points: number[][]

  styleProps: TDShapeStyleKeys = ['color', 'size']

  styles!: FreeDrawShapeStyles

  constructor(shape: FreeDrawShapeCreateProps) {
    super(shape)
    this.points = shape.points || [[0, 0]]
    this.initStyles(shape.styles)
  }

  getBounds() {
    // TODO: use cache register
    const bounds = getBoundsFromPoints(this.points)
    return translateBounds(bounds, this.point)
  }

  transform(bounds: TransformedBounds) {
    const initialShapeBounds = this.getBounds()

    const points = this.points.map(([x, y]) => [
      bounds.width
      * (bounds.scaleX < 0 // * sin?
        ? 1 - x / initialShapeBounds.width
        : x / initialShapeBounds.width),
      bounds.height
      * (bounds.scaleY < 0 // * cos?
        ? 1 - y / initialShapeBounds.height
        : y / initialShapeBounds.height),
    ])

    const newBounds = getBoundsFromPoints(points)
    const point = sub([bounds.minX, bounds.minY], [newBounds.minX, newBounds.minY])

    return this.produce({ points, point })
  }

  addPoint(newPoint: number[]) {
    const topLeft = [
      Math.min(this.point[0], newPoint[0]),
      Math.min(this.point[1], newPoint[1]),
    ]

    return produce(this, (draft) => {
      draft.points.push(sub(newPoint, draft.point))

      if (!isEqual(draft.point, topLeft)) {
        draft.points = translatePoints(draft.points, sub(draft.point, topLeft))
        draft.point = topLeft
      }

      draft.points = draft.points.map(p => toFixed(p))
    })
  }

  getEntity() {
    return { ...super.getEntity(), points: this.points } as FreeDrawEntity
  }
}
export default FreeDrawShape
