import React from 'react'
import { render } from 'react-dom'
import './styles/global.css'

import Pad from './Pad'
import PadRAS from './PadRAS'
import Timer from './Timer'

const App = () => (
  <div>
    <h1>TypeLess Demo</h1>
    
    {/* <PadRAS /> */}
    
    <Pad />
    {/* <Timer /> */}
  </div>
)

render( <App />, document.getElementById('app'))
