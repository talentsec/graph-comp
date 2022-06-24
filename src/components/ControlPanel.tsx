/* eslint-disable no-unused-vars */
import React from 'react'
import { countLinks, countNodes } from '../utils/handleData'
import styles from './ControlPanel.module.css'
import { GraphData } from './ForceDirectedGraph'

interface IPorps {
  data: GraphData
  switchType: () => void
}

const ControlPanel: React.FC<IPorps> = ({ data, switchType }) => {
  const nodes = countNodes(data.nodes)
  const links = countLinks(data.links)
  console.log('count links', links)

  return (
    <div className={styles.control_panel}>
      <span className={styles.header}>控制面板</span>
      <div className={styles.body}>
        <div className={styles.node}>
          <span>节点</span>
          <div className={styles.node_count}>
            {nodes.map((node, idx) => (
              <span className={styles.label} key={idx}>
                {node.label}({node.num})
              </span>
            ))}
          </div>
        </div>

        <div className={styles.link}>
          <span>关系</span>
          <div className={styles.link_count}>
            {links.map((link, idx) => (
              <span className={styles.label} key={idx}>
                {link.type}({link.num})
              </span>
            ))}
          </div>
        </div>

        <button
          className={styles.switch_btn}
          onClick={() => {
            switchType()
          }}
        >
          switch
        </button>
      </div>
    </div>
  )
}

export default ControlPanel
