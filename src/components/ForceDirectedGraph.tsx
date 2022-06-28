/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useRef } from 'react'
import { GraphData, VizType } from '../utils/type'
import { Visualization } from '../utils/visualization'
import { StateContext } from './DataVisualization'
import styles from './ForceDirectedGraph.module.css'

interface IProps {
  // data: GraphData
}


const ForceDirectedGraph: React.FC<IProps> = () => {
  const simulation = useRef<Visualization | null>(null)

  const { data, vizType, linkTextShow } = useContext(StateContext)

  useEffect(() => {
    if (!simulation.current) {
      simulation.current = new Visualization('#graph', data, vizType, linkTextShow)
    }
    if (simulation.current.status === 'created') {
      simulation.current.restart(vizType, linkTextShow)
    } else {
      simulation.current.create()
    }
  }, [vizType, linkTextShow])

  return <div className={styles.graph} id='graph' />
}

export default ForceDirectedGraph
