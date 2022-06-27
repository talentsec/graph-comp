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
  const [linkTextShow, setLinkTextShow] = useState<boolean>(true)

  const switchThisType = () => {
    if (vizType === 'tree') {
      setVizType('graph')
    } else {
      setVizType('tree')
    }
  }

  const switchThisTextShow = () => {
    setLinkTextShow(!linkTextShow)
  }

  return (
    <div className={styles.data_viz}>
      <div className={styles.graph_con}>
        <ForceDirectedGraph data={{ nodes, links }} vizType={vizType} linkTextShow={linkTextShow}/>
      </div>
      <div className={styles.panel_con}>
        <ControlPanel
          data={{ nodes, links }}
          switchType={() => {
            switchThisType()
          }}
          switchTextShow={() => {
            switchThisTextShow()
          }}
        />
      </div>
    </div>
  )
}

export default DataVisualization
