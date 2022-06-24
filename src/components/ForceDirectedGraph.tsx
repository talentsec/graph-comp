/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from 'react'
import { Visualization } from '../utils/visualization'
import styles from './ForceDirectedGraph.module.css'

interface IProps {
  data: GraphData
  vizType: VizType
}

export type GraphData = {
  nodes: any[]
  links: any[]
}

export type VizType = 'tree' | 'graph'

const ForceDirectedGraph: React.FC<IProps> = ({ data, vizType }) => {
  const simulation = useRef<Visualization | null>(null)

  useEffect(() => {
    if (!simulation.current) {
      simulation.current = new Visualization(data, vizType)
    }
    if (simulation.current.status === 'created') {
      simulation.current.restart(vizType)
    } else {
      simulation.current.create()
    }
  }, [vizType])

  return <div className={styles.graph} id='graph' />
}

export default ForceDirectedGraph
