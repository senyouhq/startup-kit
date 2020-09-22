import 'core-js/stable'

import React from 'react'
import { render } from 'react-dom'
import smoothscroll from 'smoothscroll-polyfill'

import CssBaseline from '@material-ui/core/CssBaseline'

smoothscroll.polyfill()

export default function rootRender(App) {
  render(
    <React.Fragment>
      <CssBaseline />
      <App />
    </React.Fragment>,
    document.getElementById('root')
  )
}
