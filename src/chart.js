import * as d3 from 'd3'
import './style.css'

export default function createBarChart(sectionBodyDisplayChart) {
  d3.select('.btn')
    .append('div')
    .attr('class', 'btn-group')

  d3.select('.btn-group')
    .append('h4')
    .text('Set x new value')

  d3.select('.btn-group')
    .append('button')
    .attr('class', 'btn-age')
    .text('random age')

  d3.select('.btn-group')
    .append('button')
    .attr('class', 'btn-height')
    .text('height')

  d3.select('.btn-group')
    .append('button')
    .attr('class', 'btn-weight')
    .text('weight')

  d3.select('.btn-group')
    .append('div')
    .attr('class', 'filter-group')

  d3.select('.filter-group')
    .append('h4')
    .text('Filters')

  d3.select('.filter-group')
    .append('button')
    .attr('class', 'btn-male')
    .text('Only Male age')

  d3.select('.filter-group')
    .append('button')
    .attr('class', 'btn-female')
    .text('Only Female age')

  d3.select('.filter-group')
    .append('button')
    .attr('class', 'btn-desc')
    .text('desc')
    .style('opacity', 0)

  d3.select('body')
    .append('div')
    .attr('class', 'tooltip')

  d3.select('.tooltip')
    .append('p')
    .attr('class', 'tooltip-text')

  d3.csv('dataset.csv')
    // MUTABLE
    /*
    .then(dataset => {
      dataset.forEach(datum => {
        Object.keys(datum).map((key) => {
          datum[key] = Number(datum[key])
        })
      })
      return dataset
    })
    */
    // IMMUTABLE
    .then(datasetDirty => {
      const datasetClean = datasetDirty.map(datum => ({
        ...datum,
        age: Number(datum.age),
        height: Number(datum.height),
        weight: Number(datum.weight),
      }))
      return datasetClean
    })
    .then(dataset => {
      const chartWidth = 800
      const chartHeight = 600
      const margin = { left: 70, top: 20, right: 70, bottom: 20 }
      const innerWidth = chartWidth - margin.left - margin.right
      const innerHeight = chartHeight - margin.top - margin.bottom
      const random = () => Math.floor(Math.random() * 10) + 1
      var randomN = () => Math.floor(Math.random() * 21) - 10
      const randomColor = () => Math.round(Math.random() * 4) + 1

      var linearGradient = d3
        .select('svg')
        .append('defs')
        .append('linearGradient')
        .attr('id', 'linear-gradient')
        .attr('gradientTransform', 'rotate(90)')

      var colorRange = ['#93b0f0', '#275aca', '#c2cfeb', '#083172', '#c7c7c7']

      var color = d3
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

      d3.select(sectionBodyDisplayChart)
        .append('svg')
        .attr('class', 'chart')

      const areaChart = d3
        .select('.chart')
        .attr('width', chartWidth)
        .attr('height', chartHeight)

      const chart = areaChart
        .append('g')
        .attr('width', innerWidth)
        .attr('height', innerHeight)
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

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

      function drawChartElement(datasetUsed, xValue, yValue) {
        currentXValue = xValue
        xScale.domain([
          d3.min(datasetUsed, d => d[xValue]) - 3,
          d3.max(datasetUsed, d => d[xValue]),
        ])
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

        const datapoints = chart.selectAll('path')

        datapoints
          .data(datasetUsed)
          .join()
          .each(datum => {
            datasetUsed.forEach(d => {
              chart
                .append('path')
                .attr('class', 'red')
                .transition()
                .duration(500)
                .attr('d', () => {
                  return [positiveArc(xScale(datum[xValue]), yScale(datum[yValue]), random)]
                })
                .attr('stroke', 'red')
                .attr('stroke-width', '1')
                .attr('fill', 'none')
                .attr('transform', `translate(0, 5) `)
                .style('opacity', 0.5)

              chart
                .append('path')
                .transition()
                .duration(500)
                .attr('defs')
                .attr('d', () => {
                  console.log(xValue)
                  return positiveArc(xScale(datum[xValue]), yScale(datum[yValue]), random)
                })
                .attr('stroke', 'url(#linear-gradient)')
                .attr('stroke-width', '1')
                .attr('fill', 'none')
            })
          })

        datapoints.exit().remove()
      }

      function positiveArc(x, y, ran) {
        console.log(randomN())
        return `M  ${x}, ${y} 
          Q 
          ${x} ${y - randomN()}, 
          ${x + ran()} ${y - randomN()}, 
          T
          ${x + 50} , ${y}`
      }

      drawChartElement(dataset, 'age', 'name')

      const toolTipDiv = d3.select('.tooltip')
      toolTipDiv.style('opacity', 0)

      const toolTipText = d3.select('.tooltip-text')

      d3.selectAll('.chart circle')
        .on('click', d => {
          d3.select(this).attr('class', 'el')
          toolTipText.text('')
          toolTipDiv
            .transition()
            .style('opacity', 1)
            .style('left', d3.event.pageX + 'px')
            .style('top', d3.event.pageY + 'px')
          toolTipText
            .append('text')
            .attr('dy', '0em')
            .text('name: ' + d.name + ' ')
          toolTipText
            .append('text')
            .attr('dy', '1em')
            .text('age: ' + d.age + ' ')
          toolTipText
            .append('text')
            .attr('dy', '1em')
            .text('height: ' + d.height + ' ')
          toolTipText
            .append('text')
            .attr('dy', '1em')
            .text('weight: ' + d.weight + ' ')
        })
        .on('mouseleave', d => {
          toolTipDiv.style('opacity', 0)
        })

      const changedOriginalDataset = dataset

      function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min
      }

      d3.select('.btn-age').on('click', () => {
        changedOriginalDataset.forEach(d => {
          d.age = getRandomInt(2, 90)
        })
        drawChartElement(changedOriginalDataset, 'age', 'name')
      })

      d3.select('.btn-height').on('click', () => {
        drawChartElement(dataset, 'height', 'name')
      })

      d3.select('.btn-weight').on('click', () => {
        drawChartElement(dataset, 'weight', 'name')
      })

      function filter(dataToBeFiltered, gender) {
        const filteredDataset = []
        dataToBeFiltered.filter(d => {
          d.sex === gender && !filteredDataset.includes(d) ? filteredDataset.push(d) : null
        })
        return filteredDataset
      }

      d3.select('.btn-male').on('click', () => {
        drawChartElement(filter(dataset, 'M'), currentXValue, 'name')
      })

      d3.select('.btn-female').on('click', () => {
        drawChartElement(filter(dataset, 'F'), currentXValue, 'name')
      })

      d3.select('.btn-desc').on('click', () => {
        const sortedDataset = dataset.sort((x, y) => {
          return d3.descending(x[currentXValue], y[currentXValue])
        })
        drawChartElement(sortedDataset, currentXValue)
      })
    })
}
