import * as React from 'react'
import type { TLTheme } from '../types'

const styles = new Map<string, HTMLStyleElement>()

type AnyTheme = Record<string, string>

function makeCssTheme<T = AnyTheme>(prefix: string, theme: T) {
  return Object.keys(theme).reduce((acc, key) => {
    const value = theme[key as keyof T]
    if (value) {
      return `${acc }${`--${prefix}-${key}`}: ${value};\n`
    }
    return acc
  }, '')
}

function useTheme<T = AnyTheme>(prefix: string, theme: T, selector = ':root') {
  React.useLayoutEffect(() => {
    const style = document.createElement('style')
    const cssTheme = makeCssTheme(prefix, theme)

    style.setAttribute('id', `${prefix}-theme`)
    style.setAttribute('data-selector', selector)
    style.innerHTML = `
        ${selector} {
          ${cssTheme}
        }
      `

    document.head.appendChild(style)

    return () => {
      if (style && document.head.contains(style)) {
        document.head.removeChild(style)
      }
    }
  }, [prefix, theme, selector])
}

function useStyle(uid: string, rules: string) {
  React.useLayoutEffect(() => {
    if (styles.get(uid)) {
      return () => null
    }

    const style = document.createElement('style')
    style.innerHTML = rules
    style.setAttribute('id', uid)
    document.head.appendChild(style)
    styles.set(uid, style)

    return () => {
      if (style && document.head.contains(style)) {
        document.head.removeChild(style)
        styles.delete(uid)
      }
    }
  }, [uid, rules])
}

const css = (strings: TemplateStringsArray, ...args: unknown[]) => strings.reduce(
  (acc, string, index) => acc + string + (index < args.length ? args[index] : ''),
  '',
)

const defaultTheme: TLTheme = {
  accent: 'rgb(255, 0, 0)',
  brushFill: 'rgba(0,0,0,.05)',
  brushStroke: 'rgba(0,0,0,.25)',
  selectStroke: 'rgb(66, 133, 244)',
  selectFill: 'rgba(65, 132, 244, 0.05)',
  containerBackground: 'rgb(68, 68, 80)',
  background: 'rgb(248, 249, 250)',
  foreground: 'rgb(51, 51, 51)',
  grid: 'rgba(144, 144, 144, 1)',
}

const tlcss = css`
  .tl-container {
    --tl-zoom: 1;
    --tl-scale: calc(1 / var(--tl-zoom));
    --tl-padding: calc(64px * max(1, var(--tl-scale)));
    --tl-performance-all: auto;
    --tl-performance-selected: auto;
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    z-index: 100;
    overflow: hidden;
    touch-action: none;
    overscroll-behavior: none;
    background-color: var(--tl-containerBackground);
    box-shadow: inset 1px 1px 10px -1px #000000
  }

  .tl-container * {
    box-sizing: border-box;
  }

  .tl-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    touch-action: none;
    pointer-events: none;
  }

  .tl-grid {
    position: absolute;
    width: 100%;
    height: 100%;
    touch-action: none;
    pointer-events: none;
    user-select: none;
  }

  .tl-canvas {
    position: absolute;
    width: 700px;
    height: 300px;
    touch-action: none;
    pointer-events: all;
    background-color: var(--tl-background);
    box-shadow: 5px 5px 6px -1px #000000;
    overflow: hidden;
  }

  .tl-layer {
    position: absolute;
    top: 0;
    left: 0;
    height: 0;
    width: 0;
    contain: layout style size;
  }

  .tl-absolute {
    position: absolute;
    top: 0;
    left: 0;
    transform-origin: center center;
    contain: layout style size;
  }

  .tl-positioned {
    position: absolute;
    top: 0;
    left: 0;
    transform-origin: center center;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    contain: layout style size;
    will-change: var(--tl-performance-all);
  }

  .tl-positioned-svg {
    width: 100%;
    height: 100%;
    overflow: hidden;
    contain: layout style size;
  }

  .tl-positioned-div {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: var(--tl-padding);
    contain: layout style size;
  }

  .tl-positioned-selected {
    will-change: var(--tl-performance-selected);
  }

  .tl-inner-div {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .tl-stroke-hitarea {
    fill: none;
    stroke: transparent;
    stroke-width: calc(24px * var(--tl-scale));
    pointer-events: stroke;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .tl-fill-hitarea {
    fill: transparent;
    stroke: transparent;
    stroke-width: calc(24px * var(--tl-scale));
    pointer-events: all;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .tl-counter-scaled {
    transform: scale(var(--tl-scale));
  }

  .tl-dashed {
    stroke-dasharray: calc(2px * var(--tl-scale)), calc(2px * var(--tl-scale));
  }

  .tl-transparent {
    fill: transparent;
    stroke: transparent;
  }

  .tl-cursor-ns {
    cursor: ns-resize;
  }

  .tl-cursor-ew {
    cursor: ew-resize;
  }

  .tl-cursor-nesw {
    cursor: nesw-resize;
  }

  .tl-cursor-nwse {
    cursor: nwse-resize;
  }

  .tl-corner-handle {
    stroke: var(--tl-selectStroke);
    fill: var(--tl-background);
    stroke-width: calc(1.5px * var(--tl-scale));
  }

  .tl-rotate-handle {
    stroke: var(--tl-selectStroke);
    fill: var(--tl-background);
    stroke-width: calc(1.5px * var(--tl-scale));
    cursor: grab;
  }

  .tl-indicator {
    fill: transparent;
    stroke-width: calc(1.5px * var(--tl-scale));
    pointer-events: none;
  }

  .tl-hovered {
    stroke: var(--tl-selectStroke);
  }

  .tl-selected {
    stroke: var(--tl-selectStroke);
  }

  .tl-editing {
    stroke-width: calc(2.5px * min(5, var(--tl-scale)));
  }

  .tl-performance {
    will-change: transform, contents;
  }

  .tl-bounds {
    pointer-events: none;
    contain: layout style size;
  }

  .tl-bounds-bg {
    stroke: none;
    fill: var(--tl-selectFill);
    pointer-events: all;
    contain: layout style size;
  }

  .tl-bounds-center {
    fill: transparent;
    stroke: var(--tl-selectStroke);
    stroke-width: calc(1.5px * var(--tl-scale));
  }

  .tl-handle {
    pointer-events: all;
    cursor: grab;
  }

  .tl-handle:hover .tl-handle-bg {
    fill: var(--tl-selectFill);
  }

  .tl-handle:hover .tl-handle-bg > * {
    stroke: var(--tl-selectFill);
  }

  .tl-handle:active .tl-handle-bg {
    cursor: grabbing;
    fill: var(--tl-selectFill);
  }

  .tl-handle:active .tl-handle-bg > * {
    stroke: var(--tl-selectFill);
  }

  .tl-handle {
    fill: var(--tl-background);
    stroke: var(--tl-selectStroke);
    stroke-width: 1.5px;
  }

  .tl-handle-bg {
    fill: transparent;
    stroke: none;
    pointer-events: all;
    r: calc(16px / max(1, var(--tl-zoom)));
  }

  .tl-centered-g {
    transform: translate(var(--tl-padding), var(--tl-padding));
  }

  .tl-current-parent > *[data-shy='true'] {
    opacity: 1;
  }

  .tl-grid-dot {
    fill: var(--tl-grid);
  }
`

const useTLTheme = (theme?: Partial<TLTheme>, selector?: string) => {
  const tltheme = React.useMemo<TLTheme>(
    () => ({
      ...defaultTheme,
      ...theme,
    }),
    [theme],
  )

  useTheme('tl', tltheme, selector)

  useStyle('tl-canvas', tlcss)
}
export default useTLTheme
