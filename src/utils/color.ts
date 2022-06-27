import * as d3 from 'd3'
import { ScaleOrdinal } from 'd3'
import { colorCategories, ColorCategory } from './constant'

export const getColor = (labelList: string[]) => {
  return d3.scaleOrdinal().domain(labelList).range(colorCategories)
}