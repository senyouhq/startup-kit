import React from 'react'
import firebase from 'service/firebase'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'

export default function SignIn() {
  const [loading, setLoading] = React.useState(false)
  const signInInitiated = React.useRef()

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged(handleAuthStateChanged)
  }, [])

  async function handleAuthStateChanged(user) {
    if (signInInitiated.current) {
      return
    }
    if (!user || user.isAnonymous) {
      signInInitiated.current = true
      return
    }

    window.location.assign('/')
  }

  async function handleLoginWithGoogle(user) {
    const provider = new firebase.auth.GoogleAuthProvider()

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(async function (result) {
        setLoading(true)
        window.location.assign('/')
      })
      .catch(function (error) {
        setLoading(false)
        const { code, message } = error
        if (code === 'auth/popup-closed-by-user') {
          return
        }

        alert(`Loginエラー：${message}`)
        throw error
      })
  }

  return (
    <div className="sign-in">
      {loading && <LinearProgress />}

      <Box textAlign="center">
        <Typography variant="h6" color="primary">
          {"Welcome to Senyou's startup-kit"}
        </Typography>
      </Box>
      {!loading && (
        <Box textAlign="center">
          <Button variant="outlined" color="primary" onClick={handleLoginWithGoogle}>
            Google でログイン
          </Button>
        </Box>
      )}
    </div>
  )
}
