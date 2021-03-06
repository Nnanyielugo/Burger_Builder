import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import classes from './BurgerBuilder.css'
import axios from '../../axios-orders';
import * as actions from '../../store/actions/';

class BurgerBuilder extends Component {
  state = {
    purchasing: false
  }

  componentDidMount() {
    this.props.onInitIngredients()
  }

  updatePurchaseState(ingredients) {
  
  //  transform ingredients object into array, map, and reduce
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey]
      })
      // turn array into a single number which is the sum of all ingredients, with a starting number of 0 
      .reduce((sum, el) => {
        return sum + el
      }, 0);
      return sum > 0;
  }


  // turn the method to arrow function to bind 'this'
  // or use a consrtuctor to bind this
  // or call the function where it is referenced and bind 'this'
  purchaseHandler = () => {
    if (this.props.isAuthenticated){
      this.setState({
        purchasing: true
      })
    } else {
      // sets authRedirect path to '/checkout so that user will be redirected there on login
      this.props.onSetAuthRedirectPath('/checkout')
      this.props.history.push('/auth')
    }    
  }

  purchaseCancelHandler = () => {
    this.setState({
      purchasing: false
    })
  }

  purchaseContinueHandler = () => {
    this.props.onInitPurchase()    
    this.props.history.push('/checkout')
  }

  render() {
    const disabledInfo = {
      // distribute the properties of the ingredients in the state
      ...this.props.ings
    }
    // loop through the ingredients, checking if the ingredients number are less than 0, 
    // return a boolean, and assign that boolean as the value of each iteration of the loop
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0
    }

    // logic for conditional rendering of spinner
    let orderSummary = null;
    // since ingredients are now fetched from the server, initialize the state with a spinner until data is retrieved
    let burger = this.props.error ? <p className={classes.ingredientErr}>Ingredients can't be loaded</p> : <Spinner />;   
    
    if(this.props.ings) {
      burger = (
        <Aux>
          <Burger ingredients={this.props.ings} />
          <BuildControls 
            ingredientAdded={this.props.onIngredientAdded}
            ingredientRemoved={this.props.onIngredientRemoved} 
            disabled={disabledInfo}
            purchaseable={this.updatePurchaseState(this.props.ings)}
            ordered={this.purchaseHandler}
            isAuth={this.props.isAuthenticated}
            price={this.props.price}
            />
        </Aux>
        );
      orderSummary = <OrderSummary 
        ingredients={this.props.ings}
        price={this.props.price}
        purchaseCancelled={this.purchaseCancelHandler}
        purchaseContinue={this.purchaseContinueHandler} />
    }

    // if(this.state.loading) {
    //   orderSummary = <Spinner />
    // }


    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
    onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
    onInitIngredients: () => dispatch(actions.initIngredients()),
    onInitPurchase: () => dispatch(actions.purchaseInit()),
    onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirect(path))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));