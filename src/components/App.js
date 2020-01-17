import React from 'react'
import ReactDOM from 'react-dom'
import * as d3 from 'd3'

const dataset = [
  { x: 20, y: 50 },
  { x: 70, y: 30 },
  { x: 10, y: 73 },
  { x: 45, y: 98 },
  { x: 83, y: 34 },
  { x: 68, y: 10 },
]

console.log(dataset)
const chart = d3.select('#root')
const chartWidth = 800
const chartHeight = 600
const margin = { left: 70, top: 20, right: 70, bottom: 20 }
const innerWidth = chartWidth - margin.left - margin.right
const innerHeight = chartHeight - margin.top - margin.bottom
const tickPadding = { one: 15, two: 25, three: 35, four: 45 }

d3.select('#chart')
  .attr('width', chartWidth)
  .attr('height', chartHeight)

d3.select('#root')
  .attr('width', innerWidth)
  .attr('height', innerHeight)
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

const yScale = d3
  .scaleLinear()
  .domain([0, d3.max(dataset.map(d => d.y))])
  .range([innerHeight, 0])
  .nice()

console.log('scale y', yScale.domain())

const xScale = d3
  .scaleLinear()
  .domain([0, d3.max(dataset.map(d => d.x))])
  .range([0, innerWidth])
  .nice()

const ticks = xScale.ticks(8)

const color = d3
  .scaleLinear()
  .domain(d3.extent(dataset.map(d => d.x)))
  .range(['red', 'blue'])
  .nice()

function XAxis() {
  return (
    <line
      x1={15}
      x2={innerWidth}
      y1={innerHeight - tickPadding.one}
      y2={innerHeight - tickPadding.one}
      stroke="black"
      strokeWidth={2}
    />
  )
}

function XTicks() {
  return (
    <g>
      {ticks.map(tick => {
        return (
          <g key={tick}>
            <line
              x1={xScale(tick)}
              x2={xScale(tick)}
              y1={innerHeight}
              y2={innerHeight - tickPadding.one}
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
  return <line x1={15} x2={15} y1={0} y2={innerHeight} stroke="black" strokeWidth={2} />
}

function YTicks() {
  return (
    <g>
      {ticks.map(tick => {
        return (
          <g key={tick}>
            <line
              x1={15}
              x2={25}
              y1={yScale(tick)}
              y2={yScale(tick)}
              stroke="black"
              strokeWidth={1}
            />
            <text y={yScale(tick) - 10} x={0} fontSize="10">
              {tick}
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
    console.log(this.props.xValue)
    this.setState({
      cx: this.props.xValue,
      cy: this.props.yValue,
      isVisible: true,
    })
  }

  render() {
    console.log('xvalue', this.props.xValue)
    return (
      <g>
        {this.state.isVisible ? (
          <CircleHoverGetAxisValue cxValue={this.state.cx} cyValue={this.state.cy} />
        ) : null}
        <circle
          onMouseEnter={this.passPropsCircle}
          onMouseLeave={() => this.setState({ isActive: false, isVisible: false })}
          r={10}
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
          console.log(datum)
          return <PointsOnChart key={i} xValue={datum.x} yValue={datum.y} />
        })}
      </svg>
    )
  }
}

const rootElement = document.getElementById('chart')
ReactDOM.render(<App />, rootElement)
