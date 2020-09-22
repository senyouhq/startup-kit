import * as React from 'react'
import axios from 'axios'
import moment from 'moment'
import firebase from 'service/firebase'

import { useProvider } from 'App/context'
import useAuth from 'hooks/useAuth'

const client = axios.create({
  baseURL: process.env.API_BASE_URL,
})

const initialState = {
  loading: false,
  loadingCount: 0,
}

function reducer(state, { type, payload }) {
  let count
  switch (type) {
    case 'set':
      return { ...state, ...payload }
    case 'increaseLoading':
      count = state.loadingCount + 1
      return { ...state, loadingCount: count, loading: count > 0 }
    case 'decreaseLoading':
      count = state.loadingCount - 1
      return { ...state, loadingCount: count < 0 ? 0 : count, loading: count > 0 }
    default:
      throw new Error('Action type not found')
  }
}

export function useRequestReducer() {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  return {
    state,
    dispatch,
  }
}

export default function useRequest() {
  const {
    request: { state, dispatch },
  } = useProvider()
  const {
    state: { tokenResult },
    dispatch: authDispatch,
  } = useAuth()

  async function getToken() {
    const diff = moment(tokenResult.expirationTime).diff(moment(), 'minutes')
    let token = tokenResult.token
    try {
      // Refresh before 10 min
      if (diff < 10) {
        await firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
        const refreshed = await firebase.auth().currentUser.getIdTokenResult()

        // Save to auth store
        authDispatch({
          type: 'setTokenResult',
          payload: refreshed,
        })
        token = refreshed.token
      }

      return token
    } catch (err) {
      console.error('getToken err:', err)
      throw err
    }
  }

  async function request(config, options = {}) {
    // Please below to how can you config
    // https://github.com/axios/axios#request-config
    const reqConfig = { ...config, headers: config.headers || {} }

    const token = await getToken()
    reqConfig.headers.Authorization = `Bearer ${token}`

    options.showLoading !== false && dispatch({ type: 'increaseLoading' })
    try {
      const result = await client(reqConfig)
      return result.data
    } catch (err) {
      console.error('request err', err)
      console.error('request config', reqConfig)
      throw err
    } finally {
      options.showLoading !== false && dispatch({ type: 'decreaseLoading' })
    }
  }

  return { state, dispatch, request, getToken, client }
}
