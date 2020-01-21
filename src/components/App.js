import React from 'react'
import ReactDOM from 'react-dom'
import * as d3 from 'd3'

const dataset = [
  { name: 'Alex', sex: 'M', age: 41, height: 74, weight: 170 },
  { name: 'Bert', sex: 'F', age: 42, height: 68, weight: 166 },
  { name: 'Carl', sex: 'M', age: 32, height: 70, weight: 155 },
  { name: 'Dave', sex: 'M', age: 39, height: 72, weight: 167 },
  { name: 'Elly', sex: 'F', age: 30, height: 66, weight: 124 },
  { name: 'Fran', sex: 'F', age: 33, height: 66, weight: 115 },
  { name: 'Gwen', sex: 'F', age: 26, height: 64, weight: 121 },
]

const chartWidth = 1200
const chartHeight = 800
const margin = { left: 90, top: 20, right: 70, bottom: 20 }
const innerWidth = chartWidth - margin.left - margin.right
const innerHeight = chartHeight - margin.top - margin.bottom
const tickPadding = { one: 15, two: 25, three: 35, four: 45 }

// const dataset = d3
//   .csv('dataset.csv')
//   .then(datasetDirty => {
//     const datasetClean = datasetDirty.map(datum => {
//       console.log('dirty', datum)
//       datum.age = Number(datum.age)
//       datum.height = Number(datum.height)
//       datum.weight = Number(datum.weight)
//     })

//     return datasetClean
//   })
//   .then(dataset => {})

d3.select('#chart')
  .attr('width', chartWidth)
  .attr('height', chartHeight)

d3.select('#root')
  .attr('width', innerWidth)
  .attr('height', innerHeight)
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

const yScale = d3
  .scalePoint()
  .domain(dataset.map(d => d.name))
  .range([innerHeight - 50, 50])

console.log('scale y', yScale('Elly'))

const xScale = d3
  .scaleLinear()
  .domain([d3.min(dataset.map(d => d.age)) - 6, d3.max(dataset.map(d => d.age))])
  .range([0, innerWidth - 50])
  .nice()

const ticks = xScale.ticks(8)

const color = d3
  .scaleLinear()
  .domain(d3.extent(dataset.map(d => d.age)))
  .range(['red', 'blue'])
  .nice()

function XAxis() {
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

function XTicks() {
  return (
    <g className="tick">
      {ticks.map(tick => {
        return (
          <g key={tick}>
            <line
              x1={xScale(tick) + tickPadding.four}
              x2={xScale(tick) + tickPadding.four}
              y1={innerHeight}
              y2={0}
              stroke="black"
              strokeWidth={1}
            />
            <text x={xScale(tick) + 10} y={innerHeight} fontSize="10">
              {tick}
            </text>
          </g>
        )
      })}
    </g>
  )
}

function YAxis() {
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

function YTicks() {
  return (
    <g className="tick ">
      {dataset.map(d => {
        return (
          <g key={d.name}>
            <line
              x1={tickPadding.four}
              x2={innerWidth}
              y1={yScale(d.name)}
              y2={yScale(d.name)}
              stroke="black"
              strokeWidth={1}
            />
            <text y={yScale(d.name) + 3} x={0} fontSize="10">
              {d.name}
            </text>
          </g>
        )
      })}
    </g>
  )
}

class PointsOnChart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isActive: false,
      isVisible: false,
      cx: 0,
      cy: 0,
    }
  }

  passPropsCircle = e => {
    this.setState({
      cx: this.props.xValue,
      cy: this.props.yValue,
      isVisible: true,
    })
  }

  render() {
    return (
      <g>
        {this.state.isVisible ? (
          <CircleHoverGetAxisValue cxValue={this.state.cx} cyValue={this.state.cy} />
        ) : null}
        <circle
          onMouseEnter={this.passPropsCircle}
          onMouseLeave={() => this.setState({ isActive: false, isVisible: false })}
          r={20}
          cx={xScale(this.props.xValue)}
          cy={yScale(this.props.yValue)}
          fill={color(this.props.xValue)}
          key={this.props.yValue}
        />
        )
      </g>
    )
  }
}

class CircleHoverGetAxisValue extends React.Component {
  render() {
    return (
      <g>
        <line
          x1={0}
          x2={xScale(this.props.cxValue)}
          y1={yScale(this.props.cyValue)}
          y2={yScale(this.props.cyValue)}
          stroke="black"
          strokeWidth={1}
        />
        <line
          x1={xScale(this.props.cxValue)}
          x2={xScale(this.props.cxValue)}
          y1={yScale(this.props.cyValue)}
          y2={innerHeight}
          stroke="black"
          strokeWidth={1}
        />
      </g>
    )
  }
}

export default class App extends React.Component {
  render() {
    return (
      <svg id="root">
        <XTicks />
        <YTicks />
        <XAxis />
        <YAxis />

        {dataset.map((datum, i) => {
          return <PointsOnChart key={i} xValue={datum.age} yValue={datum.name} />
        })}
      </svg>
    )
  }
}

const rootElement = document.getElementById('chart')
ReactDOM.render(<App />, rootElement)
