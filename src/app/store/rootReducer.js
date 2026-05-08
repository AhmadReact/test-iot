import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import loader from '../main/apps/e-commerce/store/loaderSlice';

import { iotAPI } from '../main/services/Apis';

import fuse from './fuse';
import i18n from './i18nSlice';
import user from './userSlice';

const persistConfig = {
  key: 'iot-root',
  storage,
  whitelist: ['user'], // only user will be persisted, add other reducers you want to persist
};

const createReducer = (asyncReducers) => {
  const combinedReducer = combineReducers({
    fuse,
    i18n,
    user,
    loader,
    ...asyncReducers,
    [iotAPI.reducerPath]: iotAPI.reducer,
  });

  const rootReducer = (state, action) => {
    /*
      Reset the redux store when user logged out
    */
    if (action.type === 'user/userLoggedOut') {
      state = undefined;
    }

    return combinedReducer(state, action);
  };

  return persistReducer(persistConfig, rootReducer);
};

export default createReducer;
