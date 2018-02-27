import React, { Component } from 'react'

import classes from './Modal.css'
import Aux from '../../../hoc/Aux/Aux';
import Backdrop from '../Backdrop/Backdrop';

class Modal extends Component {

  /* since Modal show property is dependent on the boolean state 'purchasing', and is set to either true or false,
   shouldComponentUpdate checks if the nextProps 'show' property has changed, and returns a boolean.
   If the boolean returns true, the component updates, and does not update otherwise.

   This is strictly for performance sake, to avoid component re-rendering.
   Since Modal wraps Order Summary, Modal's shouldComponentDidUpdate also controls Order Summary's rendering.

   We could have used PureComponent, but since it does more checks than we want to, we're manually doing the checks.
   */
  shouldComponentUpdate(nextProps, nextState) {
    // include check for when props of children have changed,
    // to show loading state (and spinner) for order component which is a child of modal comp
    return nextProps.show !== this.props.show || nextProps.children !== this.props.children
  }

// re-rendering checks
  componentWillUpdate(){
    console.log('[Modal] will update')
    // alert('Component will update')
  }

  componentDidUpdate(){
    // alert('Component has updated')
    console.log('Component has updated')
  }

  render() {
    console.log('Rendering')
    return (
      <Aux>
        <Backdrop show={this.props.show} clicked={this.props.modalClosed}/>
        <div 
          className={classes.Modal} 
          style={{
            transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh',
            opacity: this.props.show ? '1' : '0'
            }}>
          {this.props.children}
        </div>
      </Aux>
    )
  }  
}

export default Modal