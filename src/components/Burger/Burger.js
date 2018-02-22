import React from 'react';

import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = props => {
  // convert 'ingredients' into array for mapping
  let _ingredients = Object.keys(props.ingredients)
    .map(igKey => {
      // returns an array of elements including its length 
      return [...Array(props.ingredients[igKey])].map((_, i) => {
        // returns an array with its length so that the appropriate amount of components are created
        return <BurgerIngredient key={igKey + i} type={igKey} />
      })
      // flatten array of arrays using reduce and merge(add) the values of all the arrays using concat
      // this males it possible to check for the length of the returned array
    }).reduce((arr, el) => {
      return arr.concat(el)
    }, [])
    if (_ingredients.length === 0) {
      _ingredients = <p>Please start adding Ingredients</p>
    }
  return (
    <div className={classes.Burger}>
      <BurgerIngredient type="bread-top" />
      {_ingredients}
      <BurgerIngredient type="bread-bottom" />
    </div>
  )
}

export default burger;