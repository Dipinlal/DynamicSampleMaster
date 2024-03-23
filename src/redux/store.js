import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';

import authReducer from './slices/authSlice';
import utilsReducer from './slices/utilsSlice';
import masterReducer from './slices/masterSlice';

const persistConfig = {
  key: 'dynamic',
  storage,
};

const rootReducer = combineReducers({
  authState: authReducer,
  utilsState: utilsReducer,
  masterState: masterReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PAUSE', 'persist/PERSIST', 'persist/PURGE', 'persist/REGISTER'],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };
