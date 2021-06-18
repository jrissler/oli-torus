import { configureStore as configureStoreReduxToolkit, Reducer } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import { rootReducer as nextReducer, initState } from './index';
import { initialState } from './preferences';

export const preloadState = initState;
export function configureStore(preloaded: any = initialState, reducer?: Reducer) {
  const logger = createLogger({
    stateTransformer: (state) => {
      const newState: any = {};

      // automatically converts any immutablejs objects to JS representation
      for (const i of Object.keys(state)) {
        if (state[i].toJS) {
          newState[i] = state[i].toJS();
        } else {
          newState[i] = state[i];
        }
      }
      return newState;
    },
  });

  const store = configureStoreReduxToolkit({
    reducer: reducer || nextReducer,
    middleware: (getDefaultMiddleware) =>
      process.env.NODE_ENV === 'development'
        ? getDefaultMiddleware().concat(logger)
        : getDefaultMiddleware(),
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState: preloadState(initialState),
  });

  if ((module as any).hot) {
    (module as any).hot.accept('./index', () => {
      store.replaceReducer(reducer || nextReducer);
    });
  }

  return store;
}
