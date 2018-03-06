import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary'
import ContactData from './ContactData/ContactData'

class Checkout extends Component {
	state = {
		ingredients: null,
		totalPrice: 0
	}

	// parse the query parameters sent from burgerBuilder
	componentWillMount() {
		const query = new URLSearchParams(this.props.location.search);
		const ingredients = {};
		let price = 0;
		for (let param of query.entries()) {
			// ['salad', '1']
			if (param[0] === 'price') {
				price = param[1]
			} else {
				ingredients[param[0]] = +param[1]
			}
			
		}
		this.setState({ingredients: ingredients, totalPrice: price})
	}

	checkoutCancelled = () => {
		this.props.history.goBack()
	}

	checkoutContinued = () => {
		this.props.history.replace('/checkout/contact-data');
	}

	render(){
		return(
			<div>
				<CheckoutSummary 
					ingredients={this.state.ingredients}
					checkoutCancelled={this.checkoutCancelled}
					checkoutContinued={this.checkoutContinued}/>
				{/* {nested routing}
					page should load beneath beneath the checkout summary.
					The path load url is now = 'current_path + new_path'  */}
				<Route 
					path={this.props.match.path + '/contact-data'} 
					// use render instead of component to render component so that we can pass props to it
					// pass props as a parameter and redistribute so we can get access to router props in the component
					// since using render to render component does not naturally give us access to router props
					render={(props) => (<ContactData ingredients={this.state.ingredients} price={this.state.totalPrice} {...props} />)} />
			</div>
		)
	}
}

export default Checkout;