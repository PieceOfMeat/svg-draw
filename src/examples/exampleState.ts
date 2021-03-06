import { TDEntity, TDShapeType, TLPage } from 'types'

const defaultPageData = {
  id: 'page',
  canvas: {
    size: [759, 439],
    src: 'https://geoawesomeness.com/wp-content/uploads/2022/03/New-York-Shadow-Map-Geoawesomeness.png',
    scale: {
      unit: 'km',
      ratio: 0.5,
    },
  },
  shapes: {
    rect1: {
      id: 'rect1',
      type: TDShapeType.Rectangle,
      childIndex: 1,
      rotation: 0,
      styles: {
        color: '#1c7ed6',
        fill: '#d2e4f4',
        size: 'M',
      },
      point: [0, 0],
      size: [100, 100],
    },
    line1: {
      id: 'line1',
      type: TDShapeType.Line,
      childIndex: 2,
      rotation: 0,
      styles: {
        color: '#36b24d',
        size: 'M',
      },
      point: [500, 200],
      handles: {
        start: {
          id: 'start',
          index: 1,
          point: [0, 0],
        },
        end: {
          id: 'end',
          index: 2,
          point: [50, 50],
        },
      },
    },
  },
} as TLPage<TDEntity>

export default defaultPageData
