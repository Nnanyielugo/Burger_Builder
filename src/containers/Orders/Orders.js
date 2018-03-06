import React, { Component } from 'react';

import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

class Orders extends Component {
  state = {
    orders: [],
    loading: true
  }
  componentDidMount() {
    axios.get('/orders.json')
      .then(res => {
        // console.log(res.data)
        // transform object recieved from database into array
        // by setting up an empty array object, looping through the db response,
        // and pushing each object in to the array.
        // in order to preserve the id of the object from the api, instead of pushing the objects into the array,
        // we push a copy of that object using the spread operator, and add the property id which is set to the key
        const fetchedOrders = []
        for (let key in res.data) {
          fetchedOrders.push({
            ...res.data[key],
            id: key
          })
        }
        console.log(fetchedOrders)
        this.setState({loading: false, orders: fetchedOrders})
      })
      .catch(err => {
        this.setState({loading: false})
      })
  }
  render() {
    return(
      <div>
        {this.state.orders.map(order => (
          <Order 
            key={order.id}
            ingredients={order.ingredients}
            price={order.price}/>
        ))}
      </div>
    )
  }
}

export default withErrorHandler(Orders, axios);