import * as d3 from 'd3'
import { DragBehavior, ForceLink, Simulation, SimulationNodeDatum } from 'd3'

const styleList = [
  { fill: '#ecb5c9', outline: '#da7298', text: '#2a2c34' },
  { fill: '#ffc454', outline: '#d7a013', text: '#2a2c34' },
  { fill: '#4c8eda', outline: '#2870c2', text: '#ffffff' },
  { fill: '#f79767', outline: '#f36924', text: '#ffffff' },
  { fill: '#c990c0', outline: '#b261a5', text: '#ffffff' },
  { fill: '#57c7e3', outline: '#35b9da', text: '#2a2c34' },
  { fill: '#d9c8ae', outline: '#c3a77e', text: '#2a2c34' },
  { fill: '#569480', outline: '#497a6b', text: '#ffffff' },
  { fill: '#a5abb6', outline: '#a4aab4', text: '#ffffff' },
]

export class VizSimulation {
  vizType: any
  data: any
  simulation: Simulation<SimulationNodeDatum, undefined> | null
  status: string
  constructor(data: any, vizType: any) {
    this.data = data
    this.vizType = vizType
    this.simulation = null
    this.status = 'init'
  }

  updateVizType(vizType: string) {
    this.vizType = vizType
  }

  restart(vizType: string) {
    this.vizType = vizType
    this.simulation?.restart()
  }

  create() {
    const width = parseFloat(d3.select('#graph').style('width'))
    const height = parseFloat(d3.select('#graph').style('height'))
  
    const root = d3.hierarchy(this.data)
    const links = root.links()
    const nodes = root.descendants()
    // const { nodes, links } = this.data

    const zoom = d3.zoom().scaleExtent([0, 8])
      .on('zoom', (event) => {
        const g = d3.selectAll('g')
        g.attr('transform', event.transform)
      }) as any
  
    const linkForce = d3.forceLink()
      .id((d: any) => d.id)
      .strength(d => 0.4)
  
    const svg = d3.select('#graph').append('svg')
      .attr('width', width)
      .attr('height', height)
    
    svg.call(zoom)
  
    this.simulation = d3.forceSimulation()
      .force('link', linkForce)
      .force('charge', d3.forceManyBody().strength(-40))
      .force('center', d3.forceCenter(width/2, height/2))
  
    const drag = d3.drag().on('start',  (event, node: any) => {
      if(!event.active) this.simulation?.alphaTarget(0.7).restart()
      node.fx = node.x
      node.fy = node.y
    }).on('drag', (event, node: any) => {
      if(!event.active) this.simulation?.alphaTarget(0.7).restart()
      node.fx = event.x
      node.fy = event.y
    }).on('end', (event, node: any) => {
      if(!event.active) {
        this.simulation?.alphaTarget(0)
      }
      node.fx = null
      node.fy = null
    }) as any
    
    svg.append("svg:defs").append("svg:marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 27)
      .attr("refY", 0)
      .attr("markerWidth", 8)
      .attr("markerHeight", 8)
      .attr("orient", "auto")
      .append("svg:path")
      .attr("d", "M0,-5 L10,0 L0,5")
      .attr("fill", "#9d9d9d")

    const linkElement = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('marker-end', d => "url(#arrow)")
      .attr('stroke-width', .7)
      .attr('stroke', "#32323233")

      const gElement = svg.attr('class', 'nodes')
        .selectAll('circle')
        .data(nodes)
        .enter()
        .append('g')
        .call(drag)

      const ringElement = gElement.append('circle')
        .attr('class', 'outline')
        .attr('r', d => 11)
        .attr('fill', d => styleList[d.height].outline)

      const nodeElement = gElement.append('circle')
        .attr('r', d => 10)
        .attr('fill', d => styleList[d.height].fill)

      const textElement  = gElement.append('text')
        .attr('fill', '#000')
        .attr('font-size', '.5em')
        .attr('opacity', .4)
        .attr('text-anchor', `middle`)
        .attr('dominant-baseline', 'middle')
        .text(d => d.depth)

  
    this.simulation.nodes(nodes as SimulationNodeDatum[]).on('tick', () => {
      if(this.vizType === 'tree') {
        ringElement.attr('cx', (d: any) => d.x).attr('cy', d => 120 * d.depth + 40)
        textElement.attr('dx', (d: any) => d.x).attr('dy', d => 120 * d.depth + 40)

        nodeElement
        .attr('cx', (d: any) => {
          return d.x
        })
        .attr('cy', d => {
          return 120 * d.depth + 40
        })

        linkElement
          .attr('x1', (d: any) => d.source.x)
          .attr('x2', (d: any) => d.target.x)
          .attr('y1', (d: any) => {
            return 120 * d.source.depth + 40
          })
          .attr('y2', d => {
            return 120 * d.target.depth + 40
          })
      } else {
        ringElement.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y)
        textElement.attr('dx', (d: any) => d.x).attr('dy', (d: any) => d.y)

        nodeElement
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y)
    
        linkElement
          .attr('x1', (d: any) => d.source.x)
          .attr('y1', (d: any) => d.source.y)
          .attr('x2', (d: any) => d.target.x)
          .attr('y2', (d: any) => d.target.y)
        }
    })
  
    this.simulation.force<ForceLink<any, any>>('link')?.links(links)

    this.status = 'created'
  }
}

