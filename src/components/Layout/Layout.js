import React, { Component } from 'react';

import Aux from '../../hoc/Aux'
import classes from './Layout.css'
import Toolbar from '../Navigation/ToolBar/Toolbar';
import SideDrawer from '../Navigation/SIdeDrawer/SideDrawer';

class Layout extends Component {
  state = {
    showSideDrawer: true
  }

  sideDrawerClosedHandler = () => {
    this.setState({
      showSideDrawer: false
    })
  }

  // showSideDrawer = () => {
  //   this.setState({
  //     showSideDrawer: true
  //   })
  // }

  render() {
    return (
      <Aux>
        <Toolbar />
        <SideDrawer open={this.state.showSideDrawer} closed={this.sideDrawerClosedHandler}/>
        <main className={classes.Content}>
          {this.props.children}
        </main>
      </Aux>
    )
  }  
}

export default Layout;