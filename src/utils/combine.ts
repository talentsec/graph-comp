// @ts-nocheck
export function combineNodes(data: any[]) {
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
}

export function combineLinks(linkData: any[], nodes: any[]) {
  let newLinkData: any[] = []
  const existNodeIdList = nodes.map(i => i.id)

  linkData.forEach(item => {
    let newItem = {
      id: item['_fields'][0]['id'],
      source: item['_fields'][0]['startNodeId'],
      target: item['_fields'][0]['endNodeId'],
      type: item['_fields'][0]['type'],
      properties: item['_fields'][0]['properties']
    }

    if(existNodeIdList.includes(newItem.source) && existNodeIdList.includes(newItem.target)) {
      newLinkData.push(newItem)
    }
  })
  return newLinkData
}

// json转换成tree
// [{ targetId: '', sourceId: '' }]
// { id: '', children: [{ id: '', children: [] }] }
let arr = [
  { "source": "0", "target": "1" },
  { "source": "1", "target": "2" },
  { "source": "2", "target": "3" },
  { "source": "3", "target": "4" },
  { "source": "4", "target": "0" }
];

function jsonToTree(data: any[], source) {

  let map = {};

  data.forEach((item) => {
      map[item.source] = item;
  });
  let val = [];

  //添加
  data.forEach(function (item) {
      let parent = map[item.target];
      if (parent) {
          (parent.children || (parent.children = [])).push(item);
      } else {
          val.push(item);
      }
  });
  return val;
};

jsonToTree(arr, '1');



// export function nodesTier(nodes: any[], links: any[]) {
//   let result: any[] = Array.from({ length: [...new Set(nodes.map(v => v.labels[0]))].length }).fill([]);
//   const seed = nodes.find(v => v.labels.findIndex((v: { labels: string[]; }) => v.toLowerCase() === 'seed') > -1);
//   const seedId = seed.id;
//   console.log('11', nodes, links, seedId);
//   const linksTree = jsonToTree(links, seedId);
//   console.log('links', linksTree)
//   links.reduce((p, v) => {
//       // 第一级
//       if (v.source.id === seedId) {
//           result[0].concat(seed.labels[0]);
//           result[1].concat(nodes.find(nv => nv.id === v.target.id).labels[0])
//       }
//       // 第二级

//   }, []);

//   // nodes找labels == seed
//   // links找source、target

// }
