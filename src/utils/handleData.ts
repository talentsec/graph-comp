import { lab } from "d3"

export function handleNodes(nodes: any[]) {
  const newData: any[] = []
  nodes.forEach((item) => {
    const newItem = {
      id: item._fields[0].id,
      label: item._fields[0].labels[0],
      properties: item._fields[0].properties
    }
    newData.push(newItem)
  })
  return newData
}

export function handleLinks(links: any[], nodes: any[]) {
  const newLinkData: any[] = []
  const existNodeIdList = nodes.map((i) => i.id)

  links.forEach((item) => {
    const newItem = {
      id: item._fields[0].id,
      source: item._fields[0].startNodeId,
      target: item._fields[0].endNodeId,
      type: item._fields[0].type,
      properties: item._fields[0].properties
    }

    if (
      existNodeIdList.includes(newItem.source) &&
      existNodeIdList.includes(newItem.target)
    ) {
      newLinkData.push(newItem)
    }
  })
  return newLinkData
}

type NodeCount = {
  label: string
  num: number
}

type LinkCount = {
  type: string
  num: number
}

/**
 * 
 * @param nodes handleNodes处理后的nodes数据
 */
export const getNodeLabels = (nodes: any[]) => {
  // const labels: string[] = []
  const labels = Array.from(new Set(nodes.map(item => item.label)))
  return labels
}

/**
 *
 * @param nodes handleNodes处理后的nodes数据
 */
export const countNodes = (nodes: any[]) => {
  const counted: NodeCount[] = []
  nodes.forEach((item) => {
    const c: NodeCount = { label: item.label, num: 0 }
    const found = counted.find((i) => i.label === item.label)

    if (!found) {
      c.num++
      counted.push(c)
    } else {
      found.num++
    }
  })
  return counted
}

/**
 *
 * @param links handleLinks处理后的links数据
 */
export const countLinks = (links: any[]) => {
  const counted: LinkCount[] = []
  links.forEach((item) => {
    const c: LinkCount = { type: item.type, num: 0 }
    const found = counted.find((i) => i.type === item.type)

    if (!found) {
      c.num++
      counted.push(c)
    } else {
      found.num++
    }
  })
  return counted
}

// const recurse = ( labels: string[], nodes: any[], links: any[]) => {

//   if(labels.length > 0) {
//     findLabels(labels, nodes, links)
//   }
// }

const findLabels = (allLabels: string[], labels: string[], nodes: any[], links: any[]) => {
  // const curNode = nodes.find(n => n.label === label)
  // const allLabels: string[] = []
  const newLabels: string[] = []

  labels.forEach(label => {
    console.log('cur label', label)
    const curNodes = nodes.filter(n => n.label === label)

    curNodes.forEach(node => {

      // links.forEach(link => {
      //   if(link.target === node.id) {
      //     const sourceNode = nodes.find(n => n.id === link.source )
      //     // console.log('find', sourceNode)
      //     if(!newLabels.includes(sourceNode.label)) {
      //       newLabels.push(sourceNode.label)
      //     }
      //   }
      // })

      const curLinks = links.filter(link => {
        return link.target === node.id
      })

      const curSourceIds = curLinks.map(cl => cl.source)
      const curLabels: string[] = []
      const curSources = nodes.filter(n => curSourceIds.includes(n.id))
      curSources.forEach(cs => {
        if(!curLabels.includes(cs.label)) {
          curLabels.push(cs.label)
        }
      })
    
      console.log('cuirLiks', node, curSourceIds, curLabels)

      // if(curLabels.length > 0) {
      //   findLabels(allLabels, curLabels, nodes, links)
      // }
    })
  })
}

export const testNodes = (nodes: any[], links: any[]) => {
  const foundLabels: string[] = []
  let rootLabels = ['Subdomain']

  findLabels(foundLabels, rootLabels, nodes, links)

  // console.log(4444, testNodes)
}