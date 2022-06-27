/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from 'react'
import { Visualization } from '../utils/visualization'
import styles from './ForceDirectedGraph.module.css'

interface IProps {
  data: GraphData
  vizType: VizType
  linkTextShow: boolean
}

export type GraphData = {
  nodes: any[]
  links: any[]
}

export type VizType = 'tree' | 'graph'

const ForceDirectedGraph: React.FC<IProps> = ({ data, vizType, linkTextShow }) => {
  const simulation = useRef<Visualization | null>(null)

  useEffect(() => {
    if (!simulation.current) {
      simulation.current = new Visualization(data, vizType, linkTextShow)
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
