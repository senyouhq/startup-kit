import 'core-js/stable'

// HMR対応するのためReactより先にインポートする必要あり
// https://github.com/gaearon/react-hot-loader#getting-started
import rootRender from 'helpers/rootRender'

import LoginConfirmation from './LoginConfirmation'

import 'css/index.scss'

rootRender(LoginConfirmation)
