import React, { useEffect, useRef, useState } from 'react'
import data from '../mock/test.json'
import './ForceDirectedGraph.css'
import { VizSimulation } from '../utils/createGraph'

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
      simulation.current = new VizSimulation(data, vizType)
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