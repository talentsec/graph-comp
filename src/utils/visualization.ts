/* eslint-disable no-unused-vars */
import * as d3 from 'd3'
import { ForceLink, json, Simulation, SimulationNodeDatum } from 'd3'
import { getColor } from './color'
import { ColorCategory, orderedLabel } from './constant'
import { GraphData, VisualizationOption } from './type'

export class Visualization {
  private element: string
  private vizType: string
  private linkTextShow: boolean
  private data: GraphData
  private simulation: Simulation<SimulationNodeDatum, undefined> | null
  public status: 'init' | 'created'

  constructor(option: VisualizationOption) {
    this.element = option.element
    this.data = option.data
    this.vizType = option.type
    this.linkTextShow = option.linkTextShow
    this.simulation = null
    this.status = 'init'
  }

  private wrapText(text: string | undefined, threshold: number) {
    if(!text) return ''
    if(typeof text !== 'string') text = JSON.stringify(text)
    if(text.length <= threshold) return text
    return text.substring(0, threshold).concat('...')
  }

  create() {
    const width = parseFloat(d3.select(this.element).style('width'))
    const height = parseFloat(d3.select(this.element).style('height'))
    const { links, nodes } = this.data
    const zoom = d3
      .zoom()
      .scaleExtent([0.3, 8])
      .on('zoom', (event) => {
        const group = d3.selectAll('.group')
        group.attr('transform', event.transform)
      }) as any

    const linkForce = d3
      .forceLink()
      .id((d: any) => d.id)
      .strength(0.1)

    const svg = d3
      .select(this.element)
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
      .attr('refX', 32)
      .attr('refY', 0)
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-3 L7,0 L0,3')
      .attr('fill', '#9d9d9d')

    const linkGroup = svg
      .append('g')
      .attr('class', 'group links')
      .selectAll('line')
      .data(links)
      .enter()
      .append('g')
      .attr('class', 'link')

    const linkElement = linkGroup
    .append('path')
    .attr('id', (d: any) => `link_id_${d.id}`)
    .attr('marker-end', 'url(#arrow)')
    .attr('stroke-width', 0.8)
    .attr('stroke', '#a5abb6')
    
    if(this.linkTextShow) {
      linkGroup
      .append('text')
      .attr('dy', '-2.5')
      .attr('text-anchor', 'middle')
      .append('textPath')
      .attr('xlink:href', (d: any) => `#link_id_${d.id}`)
      .attr('startOffset', '50%')
      .attr('class', 'link-label')
      .attr('fill', '#a5abb6')
      .style('font', 'normal .5em Arial')
      .text((d: any) => d.type)
    }

    const nodeGroup = svg
      .append('g')
      .attr('class', 'group nodes')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(drag)

    const genColor = getColor(orderedLabel)

    const ringElement = nodeGroup
      .append('circle')
      .attr('class', 'outline')
      .attr('r', 17)
      .attr('fill', (d: any) => {
        const colorCate = genColor(d.label) as ColorCategory
        return colorCate.outline
      })

    const nodeElement = nodeGroup
      .append('circle')
      .attr('r', 16)
      .attr('fill', (d: any) => {
        const colorCate = genColor(d.label) as ColorCategory
        return colorCate.fill
      })

    const textElement = nodeGroup
      .append('text')
      .attr('fill', (d: any) => {
        const colorCate = genColor(d.label) as ColorCategory
        return colorCate.text
      })
      .attr('font-size', '.3em')
      .style('font-family', "'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue','sans-serif'")
      .attr('opacity', 0.5)
      .attr('text-anchor', `middle`)
      .attr('dominant-baseline', 'middle')
      .text((d: any) => {
        return this.wrapText(d.properties.val, 12)
      })

    this.simulation.nodes(nodes as SimulationNodeDatum[]).on('tick', () => {
      const getH = (l: string) => {
        const h = orderedLabel.findIndex((s) => s === l)
        return h === -1 ? orderedLabel.length * 100 + 160 : 100 * h + 40
      }

      if (this.vizType === 'tree') {
        ringElement
          .attr('cx', (d: any) => d.x)
          .attr('cy', (d: any) => {
            return getH(d.label)
          })
        textElement
          .attr('dx', (d: any) => d.x)
          .attr('dy', (d: any) => {
            return getH(d.label)
          })

        nodeElement
          .attr('cx', (d: any) => {
            return d.x
          })
          .attr('cy', (d: any) => {
            return getH(d.label)
          })

        linkElement.attr(
          "d",
          (d: any) => {
            let x1 = d.source.x
            let x2 = d.target.x
            let y1 = getH(d.source.label)
            let y2 = getH(d.target.label)
            return `M ${x1} ${y1} L ${x2} ${y2}`
          }
        )
      } else {
        ringElement.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y)
        textElement.attr('dx', (d: any) => d.x).attr('dy', (d: any) => d.y)
        nodeElement.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y)
        linkElement.attr(
          "d",
          d => `M ${d.source.x} ${d.source.y} L ${d.target.x} ${d.target.y}`
        )
      }
    })

    if (this.simulation && this.simulation.force<ForceLink<any, any>>('link')) {
      // eslint-disable-next-line no-unused-expressions
      this.simulation.force<ForceLink<any, any>>('link')?.links(links)
    }
    this.status = 'created'
  }

  restart(vizType: string, linkTextShow: boolean) {
    this.vizType = vizType
    this.linkTextShow = linkTextShow
    const linkGroup = d3.selectAll('.link')

    if(this.linkTextShow) {
      linkGroup.append('text')
      .attr('dy', '-2.5')
      .attr('text-anchor', 'middle')
      .append('textPath')
      .attr('xlink:href', (d: any) => `#link_id_${d.id}`)
      .attr('startOffset', '50%')
      .attr('class', 'link-label')
      .attr('fill', '#a5abb6')
      .style('font', 'normal .4em Arial')
      .text((d: any) => d.type)
    } else {
      linkGroup.selectAll('text').remove()
    }

    this.simulation && this.simulation.restart()
  }
}
