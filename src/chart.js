import * as d3 from 'd3'
import './style.css'

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

const randomN = () => Math.floor(Math.random() * 40) - 20
const randomColor = () => Math.round(Math.random() * 4) + 1

function drawNodePath(x, y, ran) {
  return `M  ${x}, ${y} 
    Q 
    ${ran()} ${ran()}, 
    ${ran()} ${ran()}, 
    T
    ${x + 50}, ${y} `
}

function generateLinearGradient(colorRange) {
  const linearGradient = d3
    .select('svg')
    .append('defs')
    .append('linearGradient')
    .attr('id', 'linear-gradient')
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

function createBarChart(dataset, domElementSelector) {
  const chartWidth = 1200
  const chartHeight = 800
  const margin = { left: 70, top: 40, right: 70, bottom: 20 }
  const colorRange = ['#93b0f0', '#275aca', '#c2cfeb', '#083172', '#c7c7c7']
  generateLinearGradient(colorRange)

  const innerWidth = chartWidth - margin.left - margin.right
  const innerHeight = chartHeight - margin.top - margin.bottom

  d3.select(domElementSelector)
    .append('svg')
    .attr('class', 'chart')

  const areaChart = d3
    .select('.chart')
    .attr('width', chartWidth)
    .attr('height', chartHeight)

  const chart = areaChart.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)

  const xScale = d3
    .scaleLinear()
    .range([0, innerWidth])
    .nice()

  const xAxis = d3.axisBottom(xScale)
  chart.append('g').attr('class', 'x-axis')

  xAxis.tickSize(-innerHeight).ticks(7)

  const yScale = d3
    .scalePoint()
    .range([0, innerHeight])
    .padding(0.7)

  const yAxis = d3.axisLeft(yScale)
  chart.append('g').attr('class', 'y-axis')

  yAxis.tickSize(-innerWidth)
  let currentXValue = 'age'
  const currentYValue = 'name'

  function drawChartElement(datasetUsed, xValue, yValue) {
    currentXValue = xValue
    xScale.domain([d3.min(datasetUsed, d => d[xValue]) - 3, d3.max(datasetUsed, d => d[xValue])])
    yScale.domain(datasetUsed.map(d => d[yValue]))

    chart
      .selectAll('.x-axis')
      .transition()
      .duration(700)
      .call(xAxis)
      .attr('transform', `translate(0, ${innerHeight})`)

    chart
      .selectAll('.y-axis')
      .transition()
      .duration(700)
      .call(yAxis)

    const numberOfPathPerDatum = new Array(30).fill(0)

    const datapoints = chart
      .selectAll('path')
      .data(datasetUsed)
      .join('path')

    datapoints.each(datum => {
      const x = xScale(datum[currentXValue])
      const coordinateY = yScale(datum[currentYValue])
      numberOfPathPerDatum.forEach(d => {
        chart
          .append('path')
          .attr('stroke', 'url(#linear-gradient)')
          .attr('stroke-width', getRandomInt(0.5, 3))
          .attr('fill', 'none')
          .attr('transform', `translate(${0},${coordinateY})`)
          .attr('d', () => drawNodePath(0, 0, randomN))
          .transition()
          .duration(500)

          .attr('transform', `translate(${x},${coordinateY})`)
      })
    })

    datapoints.exit().remove()
  }

  drawChartElement(dataset, 'age', currentYValue)

  const btnGroupText = [{ age: 'Age' }, { height: 'Height' }, { weight: 'Weight' }]

  for (let i = 0; i < btnGroupText.length; i++) {
    const xVal = Object.keys(btnGroupText[i]).flat()
    const textBtn = Object.values(btnGroupText[i]).flat()
    d3.select('.buttons-x')
      .append('button')
      .text(textBtn)
      .on('click', () => {
        currentXValue = xVal[0]
        drawChartElement(dataset, currentXValue, currentYValue)
      })
  }

  const filtersGroupText = [{ M: ' only men' }, { F: ' only women' }]

  for (let i = 0; i < filtersGroupText.length; i++) {
    const xVal = Object.keys(filtersGroupText[i]).flat()
    const textBtn = Object.values(filtersGroupText[i]).flat()
    d3.select('.filter-group')
      .append('button')
      .text(textBtn)
      .on('click', () => {
        const filteredDataset = dataset.filter(d => d.sex === xVal[0])
        drawChartElement(filteredDataset, currentXValue, currentYValue)
      })
  }
}

export default function requestDatasetAndCreateBarChart(sectionBodyDisplayChart) {
  createButtons()

  d3.csv('dataset.csv')
    .then(datasetDirty => {
      const datasetClean = datasetDirty.map(datum => ({
        ...datum,
        age: Number(datum.age),
        height: Number(datum.height),
        weight: Number(datum.weight),
        random: getRandomInt(5, 90),
      }))
      console.log(datasetClean)
      return datasetClean
    })
    .then(dataset => {
      createBarChart(dataset, sectionBodyDisplayChart)
    })
}

function createButtons() {
  d3.select('.btn')
    .append('div')
    .attr('class', 'btn-group')

  d3.select('.btn-group')
    .append('g')
    .attr('class', 'buttons-x')
    .append('h4')
    .text('Set x new value')

  d3.select('.btn-group')
    .append('div')
    .attr('class', 'filter-group')

  d3.select('.filter-group')
    .append('h4')
    .text('Filters')
}
