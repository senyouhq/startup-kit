import * as React from 'react'
import firebase from 'service/firebase'
import { useProvider } from 'App/context'

const initialState = {
  tokenResult: null,
  login: null,
  user: null,
  initialChecked: false,
}

function reducer(state, { type, payload }) {
  switch (type) {
    case 'set':
      return { ...state, ...payload }
    case 'setTokenResult':
      return { ...state, tokenResult: payload }
    default:
      throw new Error('Action type not found')
  }
}

export function useAuthReducer() {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  return {
    state,
    dispatch,
  }
}

export default function () {
  const {
    auth: { state, dispatch },
  } = useProvider()

  function login() {
    const user = {
      name: 'User 1',
    }
    dispatch({ type: 'set', payload: { user } })
  }

  function logout() {
    dispatch({ type: 'set', payload: { user: null, tokenResult: null } })
  }

  function signOut() {
    dispatch({ type: 'set', payload: { initialChecked: false, user: null, tokenResult: null } })
    return firebase.auth().signOut()
  }
  return {
    state: state,
    dispatch: dispatch,
    initialChecked: state.initialChecked,
    login,
    logout,
    signOut,
  }
}
