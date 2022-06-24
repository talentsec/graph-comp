/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { handleLinks, handleNodes } from '../utils/handleData'
import ForceDirectedGraph, { GraphData, VizType } from './ForceDirectedGraph'
import styles from './DataVisualization.module.css'
import ControlPanel from './ControlPanel'

interface IProps {
  data: GraphData
}

const DataVisualization: React.FC<IProps> = ({ data }) => {
  const nodes = handleNodes(data.nodes)
  const links = handleLinks(data.links, nodes)
  const [vizType, setVizType] = useState<VizType>('tree')

  const switchThis = () => {
    if (vizType === 'tree') {
      setVizType('graph')
    } else {
      setVizType('tree')
    }
  }

  return (
    <div className={styles.data_viz}>
      <div className={styles.graph_con}>
        <ForceDirectedGraph data={{ nodes, links }} vizType={vizType} />
      </div>
      <div className={styles.panel_con}>
        <ControlPanel
          data={{ nodes, links }}
          switchType={() => {
            switchThis()
          }}
        />
      </div>
    </div>
  )
}

export default DataVisualization
