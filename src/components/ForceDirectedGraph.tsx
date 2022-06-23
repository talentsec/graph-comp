import React, { useEffect, useRef, useState } from 'react'
import _nodes from '../mock/data-nodes.json'
import _links from '../mock/data-links.json'
import './ForceDirectedGraph.css'
import { VizSimulation } from '../utils/createGraph'
import { combineLinks, combineNodes, nodesTier } from '../utils/combine'

const nodes = combineNodes(_nodes);
const links = combineLinks(_links as any, nodes);

console.log('nodes', nodes, links);
// const tier = nodesTier(nodes, links);
// console.log('tier', tier);

interface IPorps {
  type: 'tree' | 'graph'
}

type VizType = 'graph' | 'tree'

const ForceDirectedGraph = () => {

  const [vizType, setVizType] = useState<VizType>('tree')

  const simulation = useRef<VizSimulation | null>(null)

  const switchVizType = () => {
    if (vizType === 'graph') {
      setVizType('tree')
    } else {
      setVizType('graph')
    }
  }

  useEffect(() => {
    if (!simulation.current) {
      simulation.current = new VizSimulation({ nodes, links }, vizType)
    }
    if (simulation.current.status === 'created') {
      simulation.current.restart(vizType)
    } else {
      simulation.current.create()
    }
  }, [vizType])

  return (
    <div id='graph'>
      <button id='btn' onClick={() => { switchVizType() }}>switch</button>
    </div>
  )
}

export default ForceDirectedGraph