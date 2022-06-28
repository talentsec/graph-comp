/* eslint-disable no-unused-vars */
import React, { createContext, useState } from 'react'
import { handleLinks, handleNodes, testNodes } from '../utils/handleData'
import ForceDirectedGraph from './ForceDirectedGraph'
import styles from './DataVisualization.module.css'
import ControlPanel from './ControlPanel'
import { GraphData, VizType } from '../utils/type'

interface IProps {
  data: GraphData
}

interface StateProps {
  data: GraphData
  vizType: VizType
  changeVizType: (vizType: VizType) => void
  linkTextShow: boolean
  changeLinkTextShow: (linkTextShow: boolean) => void
}

export const StateContext = createContext({} as StateProps)

const DataVisualization: React.FC<IProps> = ({ data }) => {
  const nodes = handleNodes(data.nodes)
  const links = handleLinks(data.links, nodes)
  const [vizType, setVizType] = useState<VizType>('tree')
  const [linkTextShow, setLinkTextShow] = useState<boolean>(false)

  console.log('order nodes', testNodes(nodes, links))

  return (
    <StateContext.Provider value={ { data: { nodes, links }, vizType, changeVizType: setVizType, linkTextShow, changeLinkTextShow: setLinkTextShow }}>
      <div className={styles.data_viz}>
        <div className={styles.graph_con}>
          <ForceDirectedGraph />
        </div>
        <div className={styles.panel_con}>
          <ControlPanel
          />
        </div>
      </div>
    </StateContext.Provider>
  )
}

export default DataVisualization
