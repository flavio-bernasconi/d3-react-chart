import * as d3 from 'd3'
import './style.css'

export default function createBarChart2(sectionBodyDisplayChart) {
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

      var attractForce = d3
        .forceManyBody()
        .strength(80)
        .distanceMax(400)
        .distanceMin(80)

      var collisionForce = d3
        .forceCollide(12)
        .strength(1)
        .iterations(100)

      var simulation = d3
        .forceSimulation(dataset)
        .alphaDecay(0.01)
        .force('attractForce', attractForce)
        .force('collisionForce', collisionForce)

      function dragstarted(d) {
        simulation.restart()
        simulation.alpha(0.7)
        d.fx = d.x
        d.fy = d.y
      }

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

      function drawChartElement(datasetUsed, xValue) {
        currentXValue = xValue
        xScale.domain([
          d3.min(datasetUsed, d => d[xValue]) - 3,
          d3.max(datasetUsed, d => d[xValue]),
        ])
        yScale.domain(datasetUsed.map(d => d.name))

        const datapoints = chart.selectAll('circle')

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

        datapoints
          .data(datasetUsed)
          .join(
            enter =>
              enter
                .append('circle')
                .attr('fill', d => (d.sex === 'M' ? 'DarkTurquoise' : 'coral'))
                .attr('r', d => d.radius)
                .attr('cy', d => yScale(d.name))
                .attr('cx', d => xScale(d[xValue])),
            update =>
              update
                .transition()
                .duration(2000)
                .attr('cy', d => yScale(d.name))
                .attr('cx', d => xScale(d[xValue]))
                .attr('r', d => d.radius)
                .attr('fill', 'black'),
            exit =>
              exit
                .transition()
                .duration(300)
                .attr('r', 50)
                .attr('fill', 'green')
                .transition()
                .duration(2000)
                .attr('r', 0)
                .attr('fill', 'red')
                .remove()
          )
          .on('start', dragstarted)
      }

      drawChartElement(dataset, 'age')

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
        drawChartElement(changedOriginalDataset, 'age')
      })

      d3.select('.btn-height').on('click', () => {
        drawChartElement(dataset, 'height')
      })

      d3.select('.btn-weight').on('click', () => {
        drawChartElement(dataset, 'weight')
      })

      function filter(dataToBeFiltered, gender) {
        const filteredDataset = []
        dataToBeFiltered.filter(d => {
          d.sex === gender && !filteredDataset.includes(d) ? filteredDataset.push(d) : null
        })
        return filteredDataset
      }

      d3.select('.btn-male').on('click', () => {
        drawChartElement(filter(dataset, 'M'), currentXValue)
      })

      d3.select('.btn-female').on('click', () => {
        drawChartElement(filter(dataset, 'F'), currentXValue)
      })

      d3.select('.btn-desc').on('click', () => {
        const sortedDataset = dataset.sort((x, y) => {
          return d3.descending(x[currentXValue], y[currentXValue])
        })
        drawChartElement(sortedDataset, currentXValue)
      })
    })
}
