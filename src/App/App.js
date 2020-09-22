import React from 'react'
import firebase from 'service/firebase'
import { BrowserRouter as Router } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'
import LinearProgress from '@material-ui/core/LinearProgress'
import useAuth from 'hooks/useAuth'
import AppRouter from './Router'

import css from './styles.scss'

const useStyles = makeStyles((theme) => ({
  app: {
    paddingBottom: theme.spacing(4),
  },
}))

function App(props) {
  const classes = useStyles()
  const auth = useAuth()

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged(handlAuthStateChanged)
  }, [])

  async function handlAuthStateChanged(user) {
    if (!user) {
      auth.dispatch({
        type: 'set',
        payload: {
          initialChecked: false,
          user: null,
          tokenResult: null,
        },
      })

      window.location.assign('/sign-in')
      return
    }
    const tokenResult = await firebase.auth().currentUser.getIdTokenResult()
    auth.dispatch({
      type: 'set',
      payload: {
        initialChecked: true,
        user: user,
        tokenResult,
      },
    })
  }

  if (!auth.state.initialChecked) {
    return <LinearProgress />
  }

  return (
    <Box className={`app ${css.class} ${classes.app}`}>
      <Router>
        <AppRouter />
      </Router>
    </Box>
  )
}

export default App
