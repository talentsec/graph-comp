/* eslint-disable no-unused-vars */
import * as d3 from 'd3'
import { ForceLink, Simulation, SimulationNodeDatum } from 'd3'
import { styleList } from './constant'

type GraphData = {
  nodes: any[]
  links: any[]
}

export class Visualization {
  private vizType: string
  private data: GraphData
  private simulation: Simulation<SimulationNodeDatum, undefined> | null
  public status: 'init' | 'created'

  constructor(data: GraphData, vizType: string) {
    this.data = data
    this.vizType = vizType
    this.simulation = null
    this.status = 'init'
  }

  create() {
    const width = parseFloat(d3.select('#graph').style('width'))
    const height = parseFloat(d3.select('#graph').style('height'))
    const { links, nodes } = this.data
    const zoom = d3
      .zoom()
      .scaleExtent([0, 8])
      .on('zoom', (event) => {
        const group = d3.selectAll('.group')
        group.attr('transform', event.transform)
      }) as any

    const linkForce = d3
      .forceLink()
      .id((d: any) => d.id)
      .strength(0.4)

    const svg = d3
      .select('#graph')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .call(zoom)

    this.simulation = d3
      .forceSimulation()
      .force('link', linkForce)
      .force('charge', d3.forceManyBody().strength(-40))
      .force('center', d3.forceCenter(width / 2, height / 2))

    const drag = d3
      .drag()
      .on('start', (event, node: any) => {
        if (!event.active) {
          this.simulation && this.simulation.alphaTarget(0.3).restart()
        }
        node.fx = node.x
        node.fy = node.y
      })
      .on('drag', (event, node: any) => {
        if (!event.active) {
          this.simulation && this.simulation.alphaTarget(0.3).restart()
        }
        node.fx = event.x
        node.fy = event.y
      })
      .on('end', (event, node: any) => {
        if (!event.active) {
          this.simulation && this.simulation.alphaTarget(0)
        }
        node.fx = null
        node.fy = null
      }) as any

    svg
      .append('svg:defs')
      .append('svg:marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 27)
      .attr('refY', 0)
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5 L10,0 L0,5')
      .attr('fill', '#9d9d9d')

    const linkElement = svg
      .append('g')
      .attr('class', 'group links')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('marker-end', 'url(#arrow)')
      .attr('stroke-width', 0.8)
      .attr('stroke', '#32323233')

    const gElement = svg
      .append('g')
      .attr('class', 'group nodes')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(drag)

    const ringElement = gElement
      .append('circle')
      .attr('class', 'outline')
      .attr('r', 13)
      .attr('fill', (d: any) => {
        let h = styleList.findIndex((s) => s.label === d.label)
        if (h === -1) h = styleList.length - 1
        return styleList[h].outline
      })

    const nodeElement = gElement
      .append('circle')
      .attr('r', 12)
      .attr('fill', (d: any) => {
        let h = styleList.findIndex((s) => s.label === d.label)
        if (h === -1) h = styleList.length - 1
        return styleList[h].fill
      })

    const textElement = gElement
      .append('text')
      .attr('fill', (d: any) => {
        let h = styleList.findIndex((s) => s.label === d.label)
        if (h === -1) h = styleList.length - 1
        return styleList[h].text
      })
      .attr('font-size', '.4em')
      .attr('opacity', 0.4)
      .attr('text-anchor', `middle`)
      .attr('dominant-baseline', 'middle')
      .text((d: any) => d.label)

    this.simulation.nodes(nodes as SimulationNodeDatum[]).on('tick', () => {
      if (this.vizType === 'tree') {
        ringElement
          .attr('cx', (d: any) => d.x)
          .attr('cy', (d: any) => {
            const h = styleList.findIndex((s) => s.label === d.label)
            return h === -1 ? styleList.length * 120 + 160 : 120 * h + 40
          })
        textElement
          .attr('dx', (d: any) => d.x)
          .attr('dy', (d: any) => {
            const h = styleList.findIndex((s) => s.label === d.label)
            return h === -1 ? styleList.length * 120 + 160 : 120 * h + 40
          })

        nodeElement
          .attr('cx', (d: any) => {
            return d.x
          })
          .attr('cy', (d: any) => {
            const h = styleList.findIndex((s) => s.label === d.label)
            return h === -1 ? styleList.length * 120 + 160 : 120 * h + 40
          })

        linkElement
          .attr('x1', (d: any) => d.source.x)
          .attr('x2', (d: any) => d.target.x)
          .attr('y1', (d: any) => {
            const h = styleList.findIndex((s) => s.label === d.source.label)
            return h === -1 ? styleList.length * 120 + 160 : 120 * h + 40
          })
          .attr('y2', (d: any) => {
            const h = styleList.findIndex((s) => s.label === d.target.label)
            return h === -1 ? styleList.length * 120 + 160 : 120 * h + 40
          })
      } else {
        ringElement.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y)
        textElement.attr('dx', (d: any) => d.x).attr('dy', (d: any) => d.y)

        nodeElement.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y)

        linkElement
          .attr('x1', (d: any) => d.source.x)
          .attr('y1', (d: any) => d.source.y)
          .attr('x2', (d: any) => d.target.x)
          .attr('y2', (d: any) => d.target.y)
      }
    })

    if (this.simulation && this.simulation.force<ForceLink<any, any>>('link')) {
      // eslint-disable-next-line no-unused-expressions
      this.simulation.force<ForceLink<any, any>>('link')?.links(links)
    }
    this.status = 'created'
  }

  restart(vizType: string) {
    this.vizType = vizType
    this.simulation && this.simulation.restart()
  }
}
