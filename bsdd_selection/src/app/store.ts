import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';

import { bsddReducer } from '../features/bsdd/bsddSlice';
import { ifcDataReducer } from '../features/ifc/ifcDataSlice';
import { settingsReducer } from '../features/settings/settingsSlice';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    ifcData: ifcDataReducer,
    bsdd: bsddReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
