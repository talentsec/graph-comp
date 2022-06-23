export const handleNodes = (data: any[]): any[] => {

  let newData: any[] = []
  data.forEach(item => {
    let newItem = {
      id: item['_fields'][0]['id'],
      label: item['_fields'][0]['labels'][0],
      properties: item['_fields'][0]['properties']
    }
    newData.push(newItem)
  })
  return newData


//   return data.reduce((p, v) => {
//     p = [...p, {
//         id: v._fields[0].id,
//         labels: v._fields[0].labels,
//         properties: v._fields[0].properties
//     }]
//     return p;
// }, [])
}

export const handleLinks = (linkData: any[], nodeData: any[]) => {

  let newLinkData: any[] = []

  linkData.forEach(item => {
    let newItem = {
      id: item['_fields'][0]['id'],
      source: item['_fields'][0]['startNodeId'],
      target: item['_fields'][0]['endNodeId'],
      type: item['_fields'][0]['type'],
      properties: item['_fields'][0]['properties']
    }

    newLinkData.push(newItem)
  })


  return newLinkData






  // return linkData.reduce((p, v) => {
  //   let field = v._fields[0];
  //     p = [...p, {
  //         id: field.id,
  //         source: field.startNodeId,
  //         target: field.endNodeId,
  //         type: field.type,
  //         properties: field.properties
  //     }]
  //   return p
  // }, [])
}