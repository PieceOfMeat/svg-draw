import type { TDCallbacks, TLPointerInfo } from 'types'
import { toFixed } from 'utils/vec'
import BaseTool from '../../BaseTool'
import FreeDrawSession from './FreeDrawSession'
import FreeDrawShape from './FreeDrawShape'

class FreeDrawTool extends BaseTool implements TDCallbacks {
  onPointerDown(info: TLPointerInfo) {
    const shape = new FreeDrawShape({
      point: toFixed(info.point),
    })

    this.sm.addShape(shape)
    this.sm.startSession(new FreeDrawSession(this.sm, shape.id))
  }
}
export default FreeDrawTool
