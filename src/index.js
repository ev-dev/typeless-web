import React from 'react'
import { render } from 'react-dom'
import './styles/global.css'

import Pad from './Pad'
import Timer from './Timer'

const App = () => (
  <div>
    <h1>TypeLess Demo</h1>
    <Pad />
    {/* <Timer /> */}
  </div>
)

render( <App />, document.getElementById('app'))
