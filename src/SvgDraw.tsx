import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import { Renderer, TLCallbackNames } from 'core'
import type { TDDocument } from 'types'
import StateManager from 'state'
import { StateManagerContext } from 'state/useStateManager'
import Toolbar from './components/Toolbar'

// On first load move camera to show canvas in the center of viewport
const useCenterCamera = (
  containerRef: React.RefObject<HTMLDivElement>,
  stateManager: StateManager,
) => {
  const firstLoadHandled = useRef(false)
  useEffect(() => {
    if (firstLoadHandled.current || !containerRef.current) return

    // Need to use a hack with ResizeObserver, because in other case stateManager.setData(data)
    // is getting executed twice in strict mode, erasing effect of camera pan
    // Otherwise containerRef.current.getBoundingClientRect() would be enough
    const resizeObserver = new ResizeObserver((entries) => {
      if (firstLoadHandled.current || !entries[0].contentRect) return
      const { canvas: { size } } = stateManager.page.state
      const { height, width } = entries[0].contentRect
      stateManager.pageState.pan([(width - size[0]) / 2, (height - size[1]) / 2])

      firstLoadHandled.current = true
    })

    resizeObserver.observe(containerRef.current)

    // eslint-disable-next-line consistent-return
    return () => resizeObserver.disconnect()
  }, [containerRef, stateManager])
}

const emptyPage = { page: { id: 'page', shapes: {} } } as TDDocument
type SvgDrawProps = {
  data: TDDocument,
  onChange?: (doc: TDDocument) => void,
  readonly?: boolean,
}

export const SvgDraw = ({ data = emptyPage, onChange, readonly = false }: SvgDrawProps) => {
  const [stateManager] = useState(() => new StateManager(data))

  useLayoutEffect(() => {
    stateManager.setShapes(data)
  }, [stateManager, data])

  useEffect(() => {
    if (onChange) {
      stateManager.subscribe(onChange)
    }
    return () => stateManager.unsubscribe()
  }, [stateManager, onChange])

  const page = stateManager.page.state
  // Need this for correct updates of page when page shapes are changed
  useSyncExternalStore(stateManager.page.subscribe, () => stateManager.page.state)
  const pageState = useSyncExternalStore(stateManager.pageState.subscribe, () => stateManager.pageState.state)

  const handleCallback = (eventName: TLCallbackNames) => (...rest: unknown[]) => {
    if (readonly
      && eventName !== 'onZoom'
      && eventName !== 'onPan'
      && eventName !== 'onDragCanvas'
    ) return
    stateManager.handleCallback(eventName, ...rest)
  }

  const containerRef = useRef<HTMLDivElement>(null)
  useCenterCamera(containerRef, stateManager)

  const { settings: { grid, hideGrid } } = pageState

  const scale = stateManager.getScale()
  const meta = useMemo(() => ({ scale }), [scale])

  return (
    <StateManagerContext.Provider value={stateManager}>
      <Renderer
        containerRef={containerRef}
        grid={grid}
        hideBounds={readonly}
        hideGrid={hideGrid}
        hideHandles={readonly}
        hideIndicators={readonly}
        hideRotateHandles={readonly}
        meta={meta}
        onDoubleClickShape={handleCallback('onDoubleClickShape')}
        onDragBoundsHandle={handleCallback('onDragBoundsHandle')}
        onDragCanvas={handleCallback('onDragCanvas')}
        onDragHandle={handleCallback('onDragHandle')}
        onDragOver={e => e.preventDefault()}
        onDragShape={handleCallback('onDragShape')}
        onDrop={handleCallback('onDrop')}
        onHoverShape={handleCallback('onHoverShape')}
        onKeyDown={handleCallback('onKeyDown')}
        onPan={handleCallback('onPan')}
        onPointCanvas={handleCallback('onPointCanvas')}
        onPointerDown={handleCallback('onPointerDown')}
        onPointerMove={handleCallback('onPointerMove')}
        onPointerUp={handleCallback('onPointerUp')}
        onPointShape={handleCallback('onPointShape')}
        onReleaseBoundsHandle={handleCallback('onReleaseBoundsHandle')}
        onReleaseShape={handleCallback('onReleaseShape')}
        onShapeBlur={handleCallback('onShapeBlur')}
        onShapeChange={handleCallback('onShapeChange')}
        onUnhoverShape={handleCallback('onUnhoverShape')}
        onZoom={handleCallback('onZoom')}
        page={page} // resize/drag shapes
        pageState={pageState}
        shapeUtils={stateManager.utils}
      />
      <Toolbar readonly={readonly} />
    </StateManagerContext.Provider>
  )
}

export default SvgDraw
