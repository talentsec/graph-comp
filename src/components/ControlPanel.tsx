/* eslint-disable no-unused-vars */
import React from 'react'
import { getColor } from '../utils/color'
import { ColorCategory, orderedLabel } from '../utils/constant'
import { countLinks, countNodes } from '../utils/handleData'
import styles from './ControlPanel.module.css'
import { GraphData } from './ForceDirectedGraph'

interface IPorps {
  data: GraphData
  switchType: () => void
  switchTextShow: () => void
}

const ControlPanel: React.FC<IPorps> = ({ data, switchType, switchTextShow }) => {
  const nodes = countNodes(data.nodes)
  const links = countLinks(data.links)
  const genColor = getColor(orderedLabel)

  return (
    <div className={styles.control_panel}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.group_title}>控制面板</span>
          <div className={styles.btns}>
            <span className={styles.btn} onClick={() => { switchType() }}>切换风格</span>
            <span className={styles.btn} onClick={() => { switchTextShow() }}>展示关系</span>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.group}>
            <div className={styles.group_title}>
              <span>节点</span>
            </div>
            <div className={styles.labels}>
              {nodes.map((node, idx) => {
                const colorCate = genColor(node.label) as ColorCategory
                console.log('colorCate', node.label , colorCate)
                return <span className={styles.label} id={styles['node_label']} style={ { backgroundColor: colorCate.fill, color: colorCate.text } } key={idx}>
                  {node.label} ({node.num})
                </span>
              })}
            </div>
          </div>

          <div className={styles.group}>
            <div className={styles.group_title}>
              <span>关系</span>
            </div>
            <div className={styles.labels}>
              {links.map((link, idx) => (
                <span className={styles.label} key={idx}>
                  {link.type} ({link.num})
                </span>
              ))}
            </div>
          </div>
          
          <div className={styles.group}>
            <span>总计 {data.nodes.length} 节点，{data.links.length} 关系</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ControlPanel
