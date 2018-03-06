import React, { Component } from 'react';

import Button from '../../../components/UI/Button/Button'
import Spinner from '../../../components/UI/Spinner/Spinner'
import classes from './ContactData.css';
import axios from '../../../axios-orders'

class ContactData extends Component {
  state = {
    name: '',
    email: '',
    address: {
      street: '',
      postalcode: ''
    },
    loading: false
  }

  orderHandler = (event) => {
    event.preventDefault()
    // set loading to true
    this.setState({loading: true})
    // alert('You continue!')
    // appending '.json' to the endpoint url is firebase specific
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.price,
      customer: {
        name: 'Kizito Onyegbule',
        address: {
          street: 'Agungi',
          zipCode: 67684,
          country: 'Nigeria'
        },
        email: 'test@email.com'
      },
      deliveryMethod: 'fastest'
    }
    axios.post('/orders.json', order)
      .then(response => {
        this.setState({loading: false})
        this.props.history.push('/'); 
      })
      .catch(error => {
        this.setState({loading: false})
      })

  }

  render() {
    let form = (
      <form>
        <input className={classes.Input} type="text" name="name" placeholder="Your name" />
        <input className={classes.Input} type="email" name="email" placeholder="Your email" />
        <input className={classes.Input} type="text" name="street" placeholder="Street" />
        <input className={classes.Input} type="text" name="postalcode" placeholder="Postal Code" />
        <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
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

export default ContactData;