import 'core-js/stable'
// HMR対応するのためReactより先にインポートする必要あり
// https://github.com/gaearon/react-hot-loader#getting-started
import { hot } from 'react-hot-loader/root'

import * as React from 'react'
import rootRender from 'helpers/rootRender'

import { Provider } from './context'
import App from './App'

import 'css/index.scss'

export default function MainApp() {
  return (
    <Provider>
      <App />
    </Provider>
  )
}

rootRender(process.env.NODE_ENV === 'development' ? hot(MainApp) : MainApp)
