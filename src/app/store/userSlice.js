/* eslint import/no-extraneous-dependencies: off */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import secureLocalStorage from "react-secure-storage";

import jwtService from "../auth/services/jwtService";
import { getCompanyDetail as getCompanyDetailApi } from "../main/services/services";

import history from "@history";
import _ from "@lodash";
import { setInitialSettings } from "app/store/fuse/settingsSlice";
import { showMessage } from "app/store/fuse/messageSlice";
import settingsConfig from "app/configs/settingsConfig";

export const setUser = createAsyncThunk(
  "user/setUser",
  async (user, { dispatch, getState }) => {
    /*
    You can redirect the logged-in user to a specific route depending on his role
    */
    if (user.loginRedirectUrl) {
      settingsConfig.loginRedirectUrl = user.loginRedirectUrl; // for example 'apps/academy'
    }

    return user;
  },
);

export const updateUserSettings = createAsyncThunk(
  "user/updateSettings",
  async (settings, { dispatch, getState }) => {
    const { user } = getState();
    const newUser = _.merge({}, user, { data: { settings } });

    dispatch(updateUserData(newUser));

    return newUser;
  },
);

export const updateUserShortcuts = createAsyncThunk(
  "user/updateShortucts",
  async (shortcuts, { dispatch, getState }) => {
    const { user } = getState();
    const newUser = {
      ...user,
      data: {
        ...user.data,
        shortcuts,
      },
    };

    dispatch(updateUserData(newUser));

    return newUser;
  },
);

export const getCompanyDetail = createAsyncThunk(
  "user/getCompanyDetail",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCompanyDetailApi();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const logoutUser = () => async (dispatch, getState) => {
  const { user } = getState();

  if (!user.role || user.role.length === 0) {
    // is guest
    return null;
  }

  history.push({
    pathname: "/",
  });

  dispatch(setInitialSettings());

  return dispatch(userLoggedOut());
};

export const updateUserData = (user) => async (dispatch, getState) => {
  if (!user.role || user.role.length === 0) {
    // is guest
    return;
  }

  jwtService
    .updateUserData(user)
    .then(() => {
      dispatch(showMessage({ message: "User data saved with api" }));
    })
    .catch((error) => {
      dispatch(showMessage({ message: error.message }));
    });
};

const initialState = {
  role: [], // guest
  companyDetail: null,
  data: {
    displayName: secureLocalStorage.getItem("name"),
    photoURL: "assets/images/avatars/brian-hughes.jpg",
    email: secureLocalStorage.getItem("email"),
    shortcuts: ["apps.calendar", "apps.mailbox", "apps.contacts", "apps.tasks"],
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLoggedOut: (state, action) => initialState,
    updateUser: (state, action) => {
      state.str = action.payload.value;
    },
  },
  extraReducers: {
    [getCompanyDetail.fulfilled]: (state, action) => {
      state.companyDetail = action.payload.data;
    },
    [getCompanyDetail.rejected]: (state) => {
      state.companyDetail = {
        logo: "assets/images/logo/logo.svg",
      };
    },
    [updateUserSettings.fulfilled]: (state, action) => action.payload,
    [updateUserShortcuts.fulfilled]: (state, action) => action.payload,
    [setUser.fulfilled]: (state, action) => ({
      ...action.payload,
      companyDetail: state.companyDetail,
    }),
  },
});

export const { userLoggedOut, updateUser } = userSlice.actions;

export const selectUser = ({ user }) => user;
export const selectCompanyDetail = ({ user }) => user.companyDetail;

export const selectUserShortcuts = ({ user }) => user.data.shortcuts;

export default userSlice.reducer;
