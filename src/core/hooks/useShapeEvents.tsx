/* eslint-disable no-param-reassign */
import * as React from 'react'
import { pointInBounds } from '../../utils'
import type { TLPointerEvent } from '../types'
import { TLContext } from './useTLContext'

const useShapeEvents = (id: string) => {
  const { callbacks, inputs, rPageState, rSelectionBounds } = React.useContext(TLContext)

  return React.useMemo(
    () => ({
      onPointerDown: (e: TLPointerEvent) => {
        if (e.dead) return
        e.dead = true
        if (!inputs.pointerIsValid(e)) return
        if (e.button === 2) {
          callbacks.onRightPointShape?.(inputs.pointerDown(e, id), e)
          return
        }
        if (e.button !== 0) return
        const info = inputs.pointerDown(e, id)
        e.currentTarget?.setPointerCapture(e.pointerId)
        // If we click "through" the selection bounding box to hit a shape that isn't selected,
        // treat the event as a bounding box click. Unfortunately there's no way I know to pipe
        // the event to the actual bounds background element.
        if (
          rSelectionBounds.current
          && pointInBounds(info.point, rSelectionBounds.current)
          && rPageState.current.selectedId !== id
        ) {
          callbacks.onPointBounds?.(inputs.pointerDown(e, 'bounds'), e)
          callbacks.onPointShape?.(info, e)
          callbacks.onPointerDown?.(info, e)
          return
        }
        callbacks.onPointShape?.(info, e)
        callbacks.onPointerDown?.(info, e)
      },
      onPointerUp: (e: TLPointerEvent) => {
        if (e.dead) return
        e.dead = true
        if (e.button !== 0) return
        inputs.activePointer = undefined
        if (!inputs.pointerIsValid(e)) return
        const isDoubleClick = inputs.isDoubleClick()
        const info = inputs.pointerUp(e, id)
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget?.releasePointerCapture(e.pointerId)
        }
        if (isDoubleClick && !(info.altKey || info.metaKey)) {
          callbacks.onDoubleClickShape?.(info, e)
        }
        callbacks.onReleaseShape?.(info, e)
        callbacks.onPointerUp?.(info, e)
      },
      onPointerMove: (e: TLPointerEvent) => {
        if (e.dead) return
        e.dead = true
        if (!inputs.pointerIsValid(e)) return
        if (inputs.pointer && e.pointerId !== inputs.pointer.pointerId) return
        const info = inputs.pointerMove(e, id)
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          callbacks.onDragShape?.(info, e)
        }
        callbacks.onPointerMove?.(info, e)
      },
      onPointerEnter: (e: React.PointerEvent) => {
        if (!inputs.pointerIsValid(e)) return
        const info = inputs.pointerEnter(e, id)
        callbacks.onHoverShape?.(info, e)
      },
      onPointerLeave: (e: React.PointerEvent) => {
        if (!inputs.pointerIsValid(e)) return
        const info = inputs.pointerEnter(e, id)
        callbacks.onUnhoverShape?.(info, e)
      },
    }),
    [inputs, callbacks, id],
  )
}
export default useShapeEvents
