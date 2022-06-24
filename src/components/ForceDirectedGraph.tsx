import React, { useEffect, useRef, useState } from 'react'
import _nodes from '../mock/data_nodes.json'
import _links from '../mock/data_links.json'

import './ForceDirectedGraph.css'
import { VizSimulation } from '../utils/createGraph'
import { handleLinks, handleNodes } from '../utils/dataHandler'
import { combineLinks, combineNodes } from '../utils/combine'

const nodes = combineNodes(_nodes);
const links = combineLinks(_links as any, nodes);

interface IPorps {
  type: 'tree' | 'graph'
}

type VizType = 'graph' | 'tree'

const ForceDirectedGraph = () => {

  const [vizType, setVizType] = useState<VizType>('tree')

  const simulation = useRef<VizSimulation | null>(null)

  const switchVizType = () => {
    if(vizType === 'graph') {
      setVizType('tree')
    } else {
      setVizType('graph')
    }
  }

  useEffect(() => {
    if(!simulation.current) {
      simulation.current = new VizSimulation({ nodes, links }, vizType)
    }
    if(simulation.current.status === 'created') {
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