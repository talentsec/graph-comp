import React from 'react'

import nodes from './mock/data_nodes.json'
import links from './mock/data_links.json'

import DataVisualization from './components/DataVisualization'

const data = { nodes, links }

const App = () => {
  return <DataVisualization data={ data }/>
}

export default App
