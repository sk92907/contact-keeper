import React, { useReducer } from 'react'
import axios from 'axios'
import AuthContext from './authContext'
import authReducer from './authReducer'
import setAuthToken from '../../utils/setAuthToken'
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS
} from '../types'

// Action creators

const config = {
  headers: {
    'Content-Type': 'application/json'
  }
}

// Load User
export const loadUser = async dispatch => {
  setAuthToken(localStorage.token)

  try {
    const res = await axios.get('/api/auth')

    dispatch({
      type: USER_LOADED,
      payload: res.data
    })
  } catch (err) {
    dispatch({ type: AUTH_ERROR })
  }
}

// Register User
export const register = async (dispatch, formData) => {
  try {
    const res = await axios.post('/api/users', formData, config)

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    })

    loadUser()
  } catch (err) {
    dispatch({
      type: REGISTER_FAIL,
      payload: err.response.data.msg
    })
  }
}

// Login User
export const login = async (dispatch, formData) => {
  try {
    const res = await axios.post('/api/auth', formData, config)

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    })

    loadUser()
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
      payload: err.response.data.msg
    })
  }
}

// Logout
export const logout = dispatch => dispatch({ type: LOGOUT })

// Clear Errors
export const clearErrors = dispatch => dispatch({ type: CLEAR_ERRORS })

// AuthState Provider Component

const AuthState = props => {
  const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null
  }

  const [state, dispatch] = useReducer(authReducer, initialState)

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthState
