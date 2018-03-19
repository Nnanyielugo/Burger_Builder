import * as types from './actionTypes';
import axios from '../../axios-orders';

export const purchaseBurgerSuccess = (id, orderData) => {
  return {
    type: types.PURCHASE_BURGER_SUCCESS,
    orderId: id,
    orderData: orderData
  }
};

export const purchaseBurgerFail = error => {
  return {
    type: types.PURCHASE_BURGER_FAIL,
    error: error
  }
};

export const purchaseBurgerStart = () => {
  return {
    type: types.PURCHASE_BURGER_START
  }
};

export const purchaseBurger = (orderData, token) => {
  return dispatch => {
    dispatch(purchaseBurgerStart())
    axios.post('/orders.json?auth=' + token, orderData)
      .then(response => {
        console.log(response);
        dispatch(purchaseBurgerSuccess(response.data.name, orderData))
      })
      .catch(error => {
        dispatch(purchaseBurgerFail(error));
      })
  }
}

export const purchaseInit = () => {
  return {
    type: types.PURCHASE_INIT
  }
};

export const fetchOrdersSuccess = orders => {
  return {
    type: types.FETCH_ORDERS_SUCCESS,
    orders: orders
  }
};

export const fetchOrdersFail = error => {
  return {
      type: types.FETCH_ORDERS_FAIL,
      error: error
  };
};

export const fetchOrdersStart = () => {
  return {
      type: types.FETCH_ORDERS_START
  };
};

export const fetchOrders = (token, userId) => {
  return dispatch => {
    dispatch(fetchOrdersStart());
    const queryParams = '?auth=' + token + '&orderBy="userId"&equalTo="' + userId + '"';
  // transform object recieved from database into array
  // by setting up an empty array object, looping through the db response,
  // and pushing each object in to the array.
  // in order to preserve the id of the object from the api, instead of pushing the objects into the array,
  // we push a copy of that object using the spread operator, and add the property id which is set to the key
    axios.get('/orders.json' + queryParams)
      .then(res => {
        const fetchedOrders = [];
        for (let key in res.data) {
          fetchedOrders.push({
            ...res.data[key],
            id: key
          })
        }
        dispatch(fetchOrdersSuccess(fetchedOrders));
      })
      .catch(error => {
        dispatch(fetchOrdersFail(error))
      });
  }
};

