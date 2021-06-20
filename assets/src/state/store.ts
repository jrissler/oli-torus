import { configureStore as configureStoreReduxToolkit, Reducer } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { rootReducer, initState } from './index';
import { initialState } from './preferences';

export function configureStore(preloaded: any = undefined, reducer?: Reducer, name?: string) {
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
    reducer: reducer || rootReducer,
    middleware: (getDefaultMiddleware) =>
      process.env.NODE_ENV === 'development'
        ? getDefaultMiddleware().concat(logger)
        : getDefaultMiddleware(),
    devTools: process.env.NODE_ENV !== 'production' ? { name } : false,
    preloadedState: preloaded || initState(initialState),
  });

  if ((module as any).hot) {
    (module as any).hot.accept('./index', () => {
      store.replaceReducer(reducer || rootReducer);
    });
  }

  return store;
}
