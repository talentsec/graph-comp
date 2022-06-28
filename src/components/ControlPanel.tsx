/* eslint-disable no-unused-vars */
import React, { useContext } from 'react'
import { getColor } from '../utils/color'
import { ColorCategory, orderedLabel } from '../utils/constant'
import { countLinks, countNodes } from '../utils/handleData'
import { StateContext } from './DataVisualization'
import styles from './ControlPanel.module.css'

interface IPorps {
}

const ControlPanel: React.FC<IPorps> = () => {
  const { data, vizType, changeVizType, linkTextShow, changeLinkTextShow } = useContext(StateContext)

  const nodes = countNodes(data.nodes)
  const links = countLinks(data.links)
  const genColor = getColor(orderedLabel)

  
  const switchType = () => {
    if(vizType === 'tree') {
      changeVizType('graph')
    } else {
      changeVizType('tree')
    }
  }

  return (
    <div className={styles.control_panel}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.group_title}>控制面板</span>
          <div className={styles.btns}>
            <span className={styles.btn} onClick={() => { switchType() }}>切换风格</span>
            <span className={styles.btn} onClick={() => { 
              changeLinkTextShow(!linkTextShow) }}>
                {
                  linkTextShow ? '关闭关系' : '展示关系'
                }
              </span>
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
