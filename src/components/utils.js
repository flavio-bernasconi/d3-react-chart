import * as d3 from 'd3'
import React from 'react'

const tickPadding = { one: 15, two: 25, three: 35, four: 45 }
const chartWidth = 1200
const chartHeight = 800
const margin = { left: 90, top: 20, right: 70, bottom: 20 }
const innerWidth = chartWidth - margin.left - margin.right
const innerHeight = chartHeight - margin.top - margin.bottom

export function YAxis() {
  return (
    <line
      x1={tickPadding.four}
      x2={tickPadding.four}
      y1={0}
      y2={innerHeight}
      stroke="black"
      strokeWidth={0}
    />
  )
}

export function XAxis() {
  return (
    <line
      x1={tickPadding.four}
      x2={innerWidth}
      y1={innerHeight - tickPadding.one}
      y2={innerHeight - tickPadding.one}
      stroke="black"
      strokeWidth={0}
    />
  )
}
