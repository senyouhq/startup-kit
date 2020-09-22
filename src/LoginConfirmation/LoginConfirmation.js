import React from 'react'
import axios from 'axios'
import firebase from 'service/firebase'
import { decodeJwt } from 'utility/endecode'

import LinearProgress from '@material-ui/core/LinearProgress'
import UserNameDialog from './UserNameDialog'

import css from './styles.scss'

const api = axios.create({
  baseURL: process.env.API_BASE_URL,
})

function LoginConfirmation() {
  const [open, setOpen] = React.useState(false)
  const [user, setUser] = React.useState(null)
  React.useEffect(() => {
    firebase.auth().onAuthStateChanged(handleAuthStateChanged)
  }, [])

  async function handleAuthStateChanged(user) {
    if (!user || user.isAnonymous) {
      window.location.assign('/sign-in')
      return
    }

    const token = await firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
    const userInfo = decodeJwt(token)
    setUser({ ...user, userInfo })

    try {
      const result = await api.get(`/v1/admin/client-users/check-registration?token=${token}`)

      if (!result.data.registered) {
        setOpen(true)
        return
      }

      window.location.assign('/')
    } catch (error) {
      alert('ユーザー情報読み込みエラー')
      // location.reload()
      throw error
    }
  }

  async function handleRegister(data) {
    setOpen(false)

    let token = await firebase.auth().currentUser.getIdToken()
    try {
      await api.post(`/v1/admin/client-users?token=${token}`, {
        name: data.name,
        brandName: data.brandName,
        introduction: data.introduction,
        email: user.email || user.userInfo.user_email,
        photo: user.photoURL,
      })

      // Refresh custom claim to take id
      await firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
      token = await firebase.auth().currentUser.getIdToken()
    } catch (error) {
      window.alert('登録失敗しました。')
      window.location.assign('/sign-in')
      return
    }

    if (data.photo) {
      try {
        const params = new FormData()
        params.append('photo', data.photo)
        await api.put(`/v1/admin/client-users/me/photo?token=${token}`, params)
      } catch (error) {
        window.alert('写真の設定が失敗しました。')
      }
    }
    window.location.assign('/')
  }

  return (
    <div className={`login-confirmation ${css.class}`}>
      <LinearProgress />
      Login confirmation
      <UserNameDialog open={open} user={user} onRegister={handleRegister}></UserNameDialog>
    </div>
  )
}

export default LoginConfirmation
