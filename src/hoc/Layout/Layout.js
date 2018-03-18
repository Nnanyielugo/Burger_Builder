import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../Aux/Aux'
import classes from './Layout.css'
import Toolbar from '../../components/Navigation/ToolBar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

class Layout extends Component {
  state = {
    showSideDrawer: false
  }

  sideDrawerClosedHandler = () => {
    this.setState({
      showSideDrawer: false
    })
  }

  sideDrawerToggleHandler = () => {
    // let sideDrawerClick = this.state.showSideDrawer
    // this.setState({
    //   showSideDrawer: !sideDrawerClick
    // })
    this.setState((prevState) => {
      return {showSideDrawer: !prevState.showSideDrawer}
    })
  }

  render() {
    return (
      <Aux>
        {/*Toolbar gets passed the sideDrawerToggleHandler as a 'drawerToggleClicked' prop, which is then passed to DrawerToggle 
        as a 'click' prop. DrawerToggle then fires the 'click' prop with an onClick event */}
        <Toolbar
          isAuth={this.props.isAuthenticated}
          drawerToggleClicked={this.sideDrawerToggleHandler}/>
        {/*SideDrawer gets passed the showSideDrawer state which is a boolean and the SideDrawerClosedHandler as a 'close; prop
        which is then passed to BackDrop as an 'open' boolean and a 'closed' prop respectively.
        Backdrop's show property then acts according to the state of the 'open' boolean, and fires the 'closed' prop via it's onClick event
         */}
        <SideDrawer
          isAuth={this.props.isAuthenticated} 
          open={this.state.showSideDrawer} 
          closed={this.sideDrawerClosedHandler}/>
        <main className={classes.Content}>
          {this.props.children}
        </main>
      </Aux>
    )
  }  
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  }
}

export default connect(mapStateToProps)(Layout);