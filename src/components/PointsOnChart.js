import React, { Component } from 'react'

export class PointsOnChart extends Component {
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
  }

  randomN = () => Math.floor(Math.random() * 40) - 20

  drawArcs = (x, y, ran) => {
    return `M  ${x}, ${y} 
          Q 
          ${ran()} ${ran()}, 
          ${ran()} ${ran()}, 
          T
          ${x + ran()}, ${y} `
  }

  render() {
    return (
      <path
        // onMouseEnter={this.passProps}
        // onMouseLeave={() => this.setState({ isActive: false, isVisible: false })}
        d={this.drawArcs(0, 0, this.randomN)}
        stoke="black"
        strokeWidth={this.getRandomInt(0.4, 3)}
        fill="none"
        stroke="url(#linear-gradient-new)"
      />
    )
  }
}
