import { createSlice, createDraftSafeSelector } from '@reduxjs/toolkit';

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    currentUser: null,
    currentModule: 'ui',
    currentMenu: '',
    role: [],
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
    setUserRoleFeatures: (state, action) => {
      state.role = action.payload?.accessibleFeatures;
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
  setUserRoleFeatures,
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

export const selectUserRoleFeatures = createDraftSafeSelector(
  selectApp,
  app => app.role,
);

export const selectIsPermission = createDraftSafeSelector(selectApp, app => {
  const isAdmin = app.role?.includes('admin');
  return isAdmin || app.role?.includes(app.currentMenu);
});
