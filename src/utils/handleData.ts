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
