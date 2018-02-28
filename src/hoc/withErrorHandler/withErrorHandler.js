import React, { Component } from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Aux/Aux';

// takes the wrapped component as an input, which then returns a function which recieves props,
// which in turn returns some jsx, including the wrapped component, distributing any props the wrapped component might receive

const withErrorHandler = (WrappedComponent, axios) => {
  return class extends Component {
    state = {
      error: null
    }

    componentWillMount() {
      // clear error on subsequent requests
      this.requestInterceptor = axios.interceptors.request.use(req => {
        this.setState({error: null})
        return req;
      })
      // set error state and assign it to error message
      // axios will be included in the higher=order wrapping on burgerBuilder comp
      this.responseInterceptor = axios.interceptors.response.use(res => res, error => {
          this.setState({error: error})
      })
    }

    // unmount interceptors when it isn't required to avoid memory leaks and undesired side effects
    componentWillUnmount(){
      // eject interceptors on unmount
      axios.interceptors.request.eject(this.requestInterceptor);
      axios.interceptors.response.eject(this.responseInterceptor);
    }

    errorConfirmedHandler = () => {
      this.setState({error: null})
    }

    render() {
      return (
        <Aux>
          <Modal show={this.state.error} modalClosed={this.errorConfirmedHandler}>
            {this.state.error ? this.state.error.message : null}
          </Modal>
          <WrappedComponent {...this.props} />
        </Aux>
      );
    }
  }
}

export default withErrorHandler;