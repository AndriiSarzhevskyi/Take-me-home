import {createContext} from 'react'

function noop() {}

export const AuthContext = createContext({
    token: null,
    userName: null,
    userId: null,
    status: null,
    login: noop,
    logout: noop,
    changeName: noop,
    isAuthenticated: false
  })