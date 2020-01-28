import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import 'modern-normalize'
import '@accurat/tachyons-lite'
import 'tachyons-extra'
import './reset.css'
import './style.css'
import chart from './chart'

function renderApp() {
  chart(document.getElementById('root1'))
  ReactDOM.render(<App />, document.getElementById('destination'))
}

// First render
renderApp()
