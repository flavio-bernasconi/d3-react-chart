import React from 'react'
import ReactDOM from 'react-dom'
import * as d3 from 'd3'
import { AnimatedDataset } from 'react-animated-dataset'
import _ from 'lodash'

import { YAxis, XAxis } from './utils'

const dataset = [
  { name: 'Alex', sex: 'M', age: 41, height: 74, weight: 170 },
  { name: 'Bert', sex: 'F', age: 42, height: 68, weight: 166 },
  { name: 'Carl', sex: 'M', age: 63, height: 70, weight: 155 },
  { name: 'Dave', sex: 'M', age: 39, height: 72, weight: 167 },
  { name: 'Elly', sex: 'F', age: 68, height: 80, weight: 124 },
  { name: 'Fran', sex: 'F', age: 33, height: 66, weight: 115 },
  { name: 'Gwen', sex: 'F', age: 26, height: 64, weight: 121 },
  { name: 'Hank', sex: 'M', age: 66, height: 85, weight: 130 },
  { name: 'Ivan', sex: 'M', age: 53, height: 65, weight: 145 },
  { name: 'Jake', sex: 'M', age: 32, height: 45, weight: 120 },
  { name: 'Kate', sex: 'F', age: 75, height: 78, weight: 178 },
  { name: 'Luke', sex: 'M', age: 23, height: 66, weight: 141 },
  { name: 'Myra', sex: 'F', age: 65, height: 24, weight: 160 },
  { name: 'Neil', sex: 'M', age: 77, height: 78, weight: 174 },
  { name: 'Omar', sex: 'M', age: 21, height: 98, weight: 139 },
  { name: 'Page', sex: 'F', age: 69, height: 46, weight: 167 },
  { name: 'Quin', sex: 'F', age: 17, height: 56, weight: 198 },
  { name: 'Ruth', sex: 'F', age: 65, height: 54, weight: 174 },
]

const randomColor = () => Math.round(Math.random() * 4) + 1

function generateLinearGradient(colorRange) {
  const linearGradient = d3
    .select('svg')
    .append('linearGradient')
    .attr('id', 'linear-gradient-new')
    .attr('gradientTransform', 'rotate(90)')

  const color = d3
    .scaleLinear()
    .range(colorRange)
    .domain([1, 2, 3, 4, 5])

  linearGradient
    .append('stop')
    .attr('offset', '0%')
    .attr('stop-color', color(randomColor()))

  linearGradient
    .append('stop')
    .attr('offset', '25%')
    .attr('stop-color', color(randomColor()))

  linearGradient
    .append('stop')
    .attr('offset', '50%')
    .attr('stop-color', color(randomColor()))

  linearGradient
    .append('stop')
    .attr('offset', '75%')
    .attr('stop-color', color(randomColor()))

  linearGradient
    .append('stop')
    .attr('offset', '100%')
    .attr('stop-color', color(randomColor()))
}

const chartWidth = 1200
const chartHeight = 800
const margin = { left: 90, top: 20, right: 70, bottom: 20 }
const innerWidth = chartWidth - margin.left - margin.right
const innerHeight = chartHeight - margin.top - margin.bottom
const tickPadding = { one: 15, two: 25, three: 35, four: 45 }

const colorRange = ['#f1fcfc', '#40e0d0', '#72b5b7', '#633a82', '#000080']

const yScale = d3.scalePoint().range([innerHeight - 50, 50])

const xScale = d3
  .scaleLinear()
  .range([0, innerWidth - 50])
  .nice()

function XTicks(props) {
  const { xScale } = props
  const ticks = xScale.ticks(5)

  return (
    <g className="tick">
      <AnimatedDataset
        dataset={ticks}
        tag="line"
        init={{
          opacity: 0,
        }}
        attrs={{
          opacity: 1,
          x1: tick => xScale(tick) + tickPadding.four,
          x2: tick => xScale(tick) + tickPadding.four,
          y1: innerHeight,
          y2: 0,
        }}
        keyFn={tick => tick}
      />
      <AnimatedDataset
        dataset={ticks}
        tag="text"
        init={{
          opacity: 0,
        }}
        attrs={{
          opacity: 1,
          text: tick => tick,
          x: tick => xScale(tick) + 10,
          y: innerHeight,
          'font-size': 12,
        }}
        keyFn={tick => tick}
      />
    </g>
  )
}

function YTicks(props) {
  const { currentDataset, yScale } = props
  const nameArr = currentDataset.map(d => d.name)
  yScale.domain(currentDataset.map(d => d.name))

  console.log(nameArr)
  return (
    <g className="tick ">
      <AnimatedDataset
        dataset={nameArr}
        tag="line"
        attrs={{
          x1: tickPadding.four + 30,
          x2: innerWidth,
          y1: tick => yScale(tick),
          y2: tick => yScale(tick),
          stroke: 'black',
          'stroke-width': 1,
        }}
      />
      <AnimatedDataset
        dataset={nameArr}
        tag="text"
        attrs={{
          x: tickPadding.four,
          y: tick => yScale(tick),
          text: tick => tick,
          'font-size': 12,
        }}
      />
    </g>
  )
}

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min
}

const randomN = () => Math.floor(Math.random() * 40) - 20
const random = () => Math.floor(Math.random() * 30) + 1

const drawArcs = (x, y, ran) => {
  return `M  ${x}, ${y} 
        Q 
        ${x + randomN()} ${y + randomN()}, 
        ${x + ran()} ${y + randomN()}, 
        T
        ${x + 50}, ${y} `
}

class GroupOfPaths extends React.Component {
  render() {
    const { xValue, yValue, xScale } = this.props
    const xValueOnScale = xScale(xValue)
    const yValueOnScale = yScale(yValue)
    const pathsPerDatum = _.times(20, () => getRandomInt(2, 30))
    console.log(yValueOnScale, yScale.domain())

    return (
      <AnimatedDataset
        dataset={pathsPerDatum}
        tag="path"
        attrs={{
          d: () => drawArcs(xValueOnScale, yValueOnScale, random),
          'stroke-width': () => getRandomInt(0.4, 3),
          fill: 'none',
          stroke: 'url(#linear-gradient-new)',
        }}
        keyFn={(d, index) => index}
      />
    )
  }
}

const datasetButtons = [
  { xvalue: 'age', label: 'btn Age' },
  { xvalue: 'height', label: 'btn Height' },
  { xvalue: 'weight', label: 'btn weight' },
]

const datasetFilters = [
  { keyFilter: 'M', label: 'only men' },
  { keyFilter: 'F', label: 'only women' },
]

class CreateButtons extends React.Component {
  render() {
    return (
      <button className="react-btn" value={this.props.xValue} onClick={this.props.changeXDomain}>
        {this.props.label}
      </button>
    )
  }
}
class CreateFilters extends React.Component {
  render() {
    const { label, filterDataset, filter } = this.props
    return (
      <button value={filter} onClick={filterDataset}>
        {label}
      </button>
    )
  }
}

export default class App extends React.Component {
  state = {
    currentXValue: 'age',
    currentDataset: dataset,
  }

  changeXDomain = e => {
    console.log(e.target.value)
    this.setState({
      currentDataset: dataset,
      currentXValue: e.target.value,
    })
  }

  filterDataset = e => {
    console.log(e.target.value)
    const filter = e.target.value
    const filteredDataset = dataset.filter(d => d.sex === filter)
    console.log('filtered', filteredDataset)
    this.setState({
      currentDataset: filteredDataset,
    })
  }

  render() {
    const { currentXValue, currentDataset } = this.state
    const { changeXDomain, filterDataset } = this

    console.log('current dataset', this.state.currentDataset)

    generateLinearGradient(colorRange)

    xScale.domain([
      d3.min(currentDataset.map(d => d[currentXValue])) - 6,
      d3.max(currentDataset.map(d => d[currentXValue])),
    ])

    yScale.domain(currentDataset.map(d => d.name))

    return (
      <React.Fragment>
        <div className="btn-react-group">
          {datasetButtons.map((button, i) => {
            return (
              <CreateButtons
                key={i}
                changeXDomain={changeXDomain}
                xValue={button.xvalue}
                label={button.label}
              />
            )
          })}
        </div>

        <div>
          {datasetFilters.map(filter => {
            return (
              <CreateFilters
                key={filter.keyFilter}
                filter={filter.keyFilter}
                filterDataset={filterDataset}
                label={filter.label}
              />
            )
          })}
        </div>

        <svg id="chart" width={chartWidth} height={chartHeight}>
          <XTicks xScale={xScale} />
          <YTicks yScale={yScale} currentDataset={currentDataset} />
          <XAxis />
          <YAxis />

          {currentDataset.map((datum, i) => {
            return (
              <GroupOfPaths
                key={i}
                xScale={xScale}
                xValue={datum[currentXValue]}
                yValue={datum.name}
              />
            )
          })}
        </svg>
      </React.Fragment>
    )
  }
}

const rootElement = document.getElementById('destination')
ReactDOM.render(<App />, rootElement)
