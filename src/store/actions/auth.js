import * as types from './actionTypes';

export const authStart = () => {
  return {
    type: types.AUTH_START
  }
}

export const authSucess = authData => {
  return {
    type: types.AUTH_SUCCESS,
    authData: authData
  }
}

export const authFail = error => {
  return {
    type: types.AUTH_FAIL,
    error: error
  }
}

export const auth = (email, password) => {
  return dispatch => {
    dispatch(authStart())
  }
}