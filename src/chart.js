import * as d3 from 'd3'
import './style.css'
import _ from 'lodash-es'

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
    ${x}, ${y} `
}

function generateLinearGradient(colorRange) {
  const linearGradient = d3
    .select('svg')
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
  const margin = { left: 70, top: 60, right: 70, bottom: 60 }
  const colorRange = ['#f1fcfc', '#40e0d0', '#72b5b7', '#633a82', '#000080']
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

  function drawChartElement(dataset, xValue, yValue) {
    currentXValue = xValue
    xScale.domain([d3.min(dataset, d => d[xValue]) - 3, d3.max(dataset, d => d[xValue])])
    yScale.domain(dataset.map(d => d[yValue]))

    chart
      .selectAll('.x-axis')
      .transition()
      .duration(1000)
      .call(xAxis)
      .attr('transform', `translate(0, ${innerHeight})`)

    chart
      .selectAll('.y-axis')
      .transition()
      .duration(1000)
      .call(yAxis)

    const pathsPerDatum = _.times(20, () => getRandomInt(2, 30))

    chart
      .selectAll('g.person')
      .data(dataset)
      .join(
        enter => {
          const el = enter.append('g').attr('class', 'person')

          el.attr('transform', d => `translate(${0}, ${yScale(d[currentYValue])})`)

          // concentricCircle(el)

          // squareLeaf(dataset, el)

          el.selectAll('path')
            .data(pathsPerDatum)
            .join(
              enterPath => enterPath.append('path'),
              updatePath => updatePath,
              exitPath => exitPath.remove()
            )
            .attr('d', () => drawNodePath(0, 0, randomN))
            .attr('stroke-width', d => getRandomInt(0.5, 4))
            .attr('stroke', 'url(#linear-gradient)')

          return el
        },
        update => update,
        exit => exit.remove()
      )
      .transition()
      .duration(1000)
      .attr(
        'transform',
        d => `translate(${xScale(d[currentXValue])}, ${yScale(d[currentYValue])}), scale(0.8)`
      )
      .attr('fill', 'none')
  }

  drawChartElement(dataset, 'age', currentYValue)

  const btnGroupText = [
    { xValue: 'age', label: 'Age' },
    { xValue: 'height', label: 'Height' },
    { xValue: 'weight', label: 'Weight' },
  ]

  btnGroupText.forEach(({ xValue, label }) => {
    d3.select('.buttons-x')
      .append('button')
      .text(label)
      .on('click', () => {
        currentXValue = xValue
        drawChartElement(dataset, currentXValue, currentYValue)
      })
  })

  const filtersGroupText = [
    { filter: 'M', label: 'only men' },
    { filter: 'F', label: 'only women' },
  ]

  filtersGroupText.forEach(({ filter, label }) => {
    d3.select('.filter-group')
      .append('button')
      .text(label)
      .on('click', () => {
        const filteredDataset = dataset.filter(d => d.sex === filter)
        drawChartElement(filteredDataset, currentXValue, currentYValue)
      })
  })
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

function concentricCircle(el) {
  var scale = d3
    .scaleLinear()
    .range(['white', 'steelblue'])
    .domain([0, 70])

  var data = [0, 10, 20, 30, 40, 50, 70]

  var circles = el
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('r', d => d)
    .attr('fill', 'none')
    .style('stroke-width', '2')
    .style('stroke', d => scale(d))

  function transition() {
    data = data.map(d => (d === 70 ? 0 : d + 10))

    // Grow circles
    circles
      .data(data)
      .filter(d => d > 0)
      .transition()
      .ease(d3.easeLinear)
      .attr('r', d => d)
      .style('stroke', d => scale(d))
      .style('opacity', d => (d === 70 ? 0 : 1))
      .duration(2300)

    // Reset circles where r == 0
    circles
      .filter(d => {
        return d === 0
      })
      .attr('r', 0)
      .style('opacity', 1)
      .style('stroke', d => scale(d))
  }

  setInterval(() => {
    transition()
  }, 2300)
}

function squareLeaf(dataset, el) {
  el.selectAll('rect')
    .data([1])
    .join(enterCircle => enterCircle.append('rect'))
    .attr('x', 0)
    .attr('x', 0)
    .attr('width', 60)
    .attr('height', 60)
    .attr('transform', `translate(-30,-30)`)
    .attr('fill', 'DarkSlateGrey')
    .attr('stroke', 'DarkSeaGreen')
    .attr('stroke-width', 4)
}
