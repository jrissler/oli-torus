import { combineReducers, Reducer } from '@reduxjs/toolkit';
import React, { useContext } from 'react';
import { Provider } from 'react-redux';
import { rootReducer } from 'state';
import { initialState } from 'state/preferences';
import { configureStore, preloadState } from 'state/store';
import { AuthoringElementProps } from './AuthoringElement';

export const ActivityContext: React.Context<AuthoringElementProps<Model> | undefined> =
  React.createContext<AuthoringElementProps<Model> | undefined>(undefined);

export function useActivityContext() {
  const context = useContext<AuthoringElementProps<Model> | undefined>(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivityContext must be used within an ActivityProvider');
  }
  return context;
}

interface ActivityProviderProps<Model> extends AuthoringElementProps<Model> {
  reducer: Reducer<Model>;
}
export const ActivityProvider: React.FC<ActivityProviderProps<unknown>> = (props) => {
  console.log('initial model', props.model);

  const store = configureStore(
    { app: preloadState(initialState), model: props.model },
    combineReducers({
      model: props.reducer,
      app: rootReducer,
    }),
  );

  // const store = useStore();
  console.log('initial store state', store.getState());

  store.subscribe(() => {
    console.log('about to call onEdit with state', store.getState());
    props.onEdit(store.getState().model);
  });
  return (
    <Provider store={store}>
      <ActivityContext.Provider value={{ ...props }}>{props.children}</ActivityContext.Provider>
    </Provider>
  );
};
