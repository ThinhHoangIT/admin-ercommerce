import { createSlice, createDraftSafeSelector } from '@reduxjs/toolkit';

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    currentUser: null,
    currentModule: 'ui',
    currentMenu: '',
  },
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setCurrentModule: (state, action) => {
      state.currentModule = action.payload;
    },
    setCurrentMenu: (state, action) => {
      state.currentMenu = action.payload;
    },
    clearAllState: (state, action) => {
      state.currentUser = null;
      state.currentMenu = null;
      state.currentModule = 'ui';
    },
  },
});
export const {
  setCurrentUser,
  setCurrentMenu,
  setCurrentModule,
  clearAllState,
} = appSlice.actions;

export default appSlice.reducer;

const selectApp = state => state.app;

export const selectCurrentUser = createDraftSafeSelector(
  selectApp,
  app => app.currentUser,
);

export const selectCurrentMenu = createDraftSafeSelector(
  selectApp,
  app => app.currentMenu,
);

export const selectCurrentModule = createDraftSafeSelector(
  selectApp,
  app => app.currentModule,
);
