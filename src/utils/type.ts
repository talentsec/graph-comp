export type GraphData = {
  nodes: any[]
  links: any[]
}

export type VizType = 'tree' | 'graph'

export type VisualizationOption = {
  element: string
  data: GraphData
  type: VizType
  linkTextShow: boolean
}