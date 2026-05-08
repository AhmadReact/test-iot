import { combineReducers } from '@reduxjs/toolkit';

import order from './orderSlice';
import orders from './ordersSlice';
import product from './productSlice';
import products from './productsSlice';
import loader from './loaderSlice';

const reducer = combineReducers({
  products,
  product,
  orders,
  order,
  loader,
});

export default reducer;
