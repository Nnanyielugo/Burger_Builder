import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../../../components/UI/Button/Button'
import Spinner from '../../../components/UI/Spinner/Spinner'
import classes from './ContactData.css';
import Input from '../../../components/UI/Input/Input';
import * as actions from '../../../store/actions/index';

class ContactData extends Component {
  // configure javascript form data in state
  state = {
    orderForm: {      
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Name'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false, 
        touched: false
      },       
      street: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Street'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      zipCode: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'ZIPCODE'
        },
        value: '',
        validation: {
          required: true,
          minLength: 5,
          maxLength: 5
        },
        valid: false,
        touched: false
      },
      country: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Country'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },       
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your E-Mail'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },      
      deliveryMethod: {
        elementType: 'select',
        elementConfig: {
          options: [
            {value: 'fastest', displayValue: 'Fastest'},
            {value: 'cheapest', displayValue: 'Cheapest'},
          ]
        },
        value: 'fastest',
        // validation: {},
        valid: true
      }
    },
    formIsValid: false,
    loading: false
  }

  orderHandler = (event) => {
    event.preventDefault()
    const formData = {};
    // forlElementIdentifier = name, address, etc
    // then access the value property in each element identifier
    for (let formElementIdentifier in this.state.orderForm) {
      formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value
    }

    const order = {
      ingredients: this.props.ings,
      price: this.props.price,
      orderData: formData,
      userId: this.props.userId
    }
    this.props.onOrderBurger(order, this.props.token)

  }

  checkValidity(value, rules) {
    let isValid = true;

    if(!rules) {
      return true;
    }

    if (rules.required) {
      // isValid is set to true if the check is true and isValid already was true.
      // this ensures that the validity check loops through all the conditions that are required and
      // updates to true only when required conditions have been satisfied
      // this means if any check is false, isValid evaluates to false even if other checks update it to true. 
      // This means that all the rules have for that input have to resolve to true.
      isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength  && isValid;
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }

    if (rules.isEmail) {
      const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      isValid = pattern.test(value) && isValid
    }

    if (rules.isNumeric) {
        const pattern = /^\d+$/;
        isValid = pattern.test(value) && isValid
    }

    return isValid;
  }

  inputChangedHandler = (event, inputIdentifier) => {
    // console.log(event.target.value)
    // make copy of state
    const updatedOrderForm = {
      ...this.state.orderForm
    }
    // make a deeper copy of state, accessing the input identifier
    const updatedFormElement = {
      ...updatedOrderForm[inputIdentifier]
    }
    updatedFormElement.value = event.target.value;
    //  check validation so that isValid affects the setState method call below
    updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation)
    updatedFormElement.touched = true;
    updatedOrderForm[inputIdentifier] = updatedFormElement;

    // check validity of overall form
    let formIsValid = true;
    for (let inputIdentifier in updatedOrderForm){
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
    }

    this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid})
  }

  render() {
    const formElementsArray = [];
    // loop through orderform keys (name, street, etc)
    for (let key in this.state.orderForm) {
      formElementsArray.push({
        id: key,
        config: this.state.orderForm[key]
      })
    }
    let form = (
      // use onSubmit handler on form instead of onClick handler on button for the submit event
      <form onSubmit={this.orderHandler} >
        {formElementsArray.map(formElement => (
          <Input 
            key={formElement.id}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            invalid={!formElement.config.valid}
            shouldValidate={formElement.config.validation}
            touched={formElement.config.touched}
            changed={(event) => this.inputChangedHandler(event, formElement.id)}/>
        ))}
        <Button btnType="Success" disabled={!this.state.formIsValid} clicked={this.orderHandler}>ORDER</Button>
      </form>
    );
    if (this.state.loading) {
      form = <Spinner />
    }
    return(
      <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>
        {form}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId
  }
}

const mapDispatchToProps = dispatch => {
  return {
      onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactData);