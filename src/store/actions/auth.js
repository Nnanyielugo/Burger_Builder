import axios from 'axios'
import * as types from './actionTypes';

export const authStart = () => {
  return {
    type: types.AUTH_START
  }
}

export const authSucess = (token, userId) => {
  return {
    type: types.AUTH_SUCCESS,
    idToken: token,
    userId: userId
  }
}

export const authFail = error => {
  return {
    type: types.AUTH_FAIL,
    error: error
  }
}

export const logout = () => {
  return {
    type: types.AUTH_LOGOUT
  }
}

export const checkAuthTimeout = (expirationTime) => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout())
    }, expirationTime * 1000)
  }
}


export const auth = (email, password, isSignup) => {
  return dispatch => {
    dispatch(authStart());
    const authData = {
      email: email,
      password: password,
      returnSecureToken: true
    }

    let url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyCrf8DH_QN72SruoZP4rS5PfRg1h5PWgZc"
    if(!isSignup){
      url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyCrf8DH_QN72SruoZP4rS5PfRg1h5PWgZc"
    }
    axios.post(url, authData)
    .then(response => {
      console.log(response);
      dispatch(authSucess(response.data.idToken, response.data.localId))
      dispatch(checkAuthTimeout(response.data.expiresIn))
    })
    .catch(err => {
      console.log(err);
      dispatch(authFail(err.response.data.error))
    })
  }
}

export const setAuthRedirect = path => {
  return {
    type: types.SET_AUTH_REDIRECT_PATH,
    path: path
  }
}