import * as types from '../actions/actionTypes';

const initialState = {
  ingredients: null,
  totalPrice: 4,
  error: false
};

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ADD_INGREDIENT:
      return {
        ...state,
        // create a deeper copy of state: one that includes the ingredients object,
        // pass a variable that contains the name we want to use as a property name, 
        // then we set the new value, selecting the ingredient name then increment by 1
        ingredients: {
          ...state.ingredients,
          [action.ingredientName]: state.ingredients[action.ingredientName] + 1
        },
        totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName]
      };
    case types.REMOVE_INGREDIENT:
      return {
        ...state,
        ingredients: {
          ...state.ingredients,
          [action.ingredientName]: state.ingredients[action.ingredientName] - 1
        },
        totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName]
      };
    case types.SET_INGREDIENTS:
      return {
        ...state,
        ingredients: action.ingredients,
        error: false
      };
    case types.FETCH_INGREDIENTS_FAILED:
      return {
        ...state,
        error: true
      }
    default:
      return state;
  }
}

export default reducer;