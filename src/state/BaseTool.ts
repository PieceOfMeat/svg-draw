import { TDCallbacks, TLPointerInfo, TLWheelEventHandler } from 'types'
import { div, isEqual, sub } from 'utils/vec'
import type StateManager from './StateManager'

/* Base operations inherent to each tool: drop file, delete shape, zoom etc */
class BaseTool implements TDCallbacks {
  sm: StateManager

  constructor(stateManager: StateManager) {
    this.sm = stateManager
  }

  onKeyDown(key: string) {
    if (key !== 'Backspace' && key !== 'Delete') return
    const shape = this.sm.getSelectedShape()
    if (!shape) return
    this.sm.clearState()
    this.sm.removeShape(shape.id)
  }

  onPan: TLWheelEventHandler = (info) => {
    const { point, zoom } = this.sm.pageState.state.camera
    const delta = div(info.delta, zoom)
    const next = sub(point, delta)

    if (isEqual(next, point)) return
    this.sm.pageState.pan(delta)
  }

  onZoom(info: TLPointerInfo) {
    const point = this.sm.canvasToScreen(info.point)
    this.sm.pageState.zoom(info.delta[2], point)
  }

  onDragCanvas(info: TLPointerInfo) {
    const { zoom } = this.sm.pageState.state.camera
    const delta = div(info.delta, zoom)
    this.sm.pageState.pan(delta)
  }
}

export default BaseTool
export { BaseTool }
