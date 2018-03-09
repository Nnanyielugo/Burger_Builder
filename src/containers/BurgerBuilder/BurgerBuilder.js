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
import * as types from '../../store/actions';

class BurgerBuilder extends Component {
  state = {
    purchasing: false,
    loading: false, 
    error: false
  }

  // componentDidMount() {
  //   axios.get('https://react-burger-96363.firebaseio.com/ingredients.json')
  //     .then(response => {
  //       this.setState({ingredients: response.data})
  //     })
  //     .catch(error => {
  //       this.setState({ error: true })
  //     })
  // }

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
    this.setState({
      purchasing: true
    })
  }

  purchaseCancelHandler = () => {
    this.setState({
      purchasing: false
    })
  }

  purchaseContinueHandler = () => {
    const queryParams = [];
    for (let i in this.props.ings) {
      // push ingredients into query params and encode them so that they can be used in the uri
      // in the format propertyName=propertyValue
      queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.props.ings[i]));
    }
    queryParams.push('price=' + this.props.price);
    // join the array of strings with an 'and' sign
    const queryString = queryParams.join('&');
    this.props.history.push({
      pathname: '/checkout',
      search: '?' + queryString
    })
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
    let burger = this.state.error ? <p className={classes.ingredientErr}>Ingredients can't be loaded</p> : <Spinner />;   
    
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

    if(this.state.loading) {
      orderSummary = <Spinner />
    }


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
    ings: state.ingredients,
    price: state.totalPrice
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: (ingName) => dispatch({type: types.ADD_INGREDIENT, ingredientName: ingName}),
    onIngredientRemoved: (ingName) => dispatch({type: types.REMOVE_INGREDIENT, ingredientName: ingName})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));