import { configureStore, Reducer } from '@reduxjs/toolkit';
import React, { useContext } from 'react';
import { Provider } from 'react-redux';
import { AuthoringElementProps } from './AuthoringElement';

export const ActivityContext: React.Context<AuthoringElementProps<T> | undefined> =
  React.createContext<AuthoringElementProps<T> | undefined>(undefined);

export function useActivityContext() {
  const context = useContext<AuthoringElementProps<T> | undefined>(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivityContext must be used within an ActivityProvider');
  }
  return context;
}
// React.FC<AuthoringElementProps<T>>
export function ActivityProvider<T, U>(
  props: React.PropsWithChildren<
    AuthoringElementProps<T> & {
      // transform: (model: T) => U;
      // untransform: (transformed: U) => T;
      // reducer: Reducer<U>;
      reducer: Reducer<T>;
    }
  >,
) {
  console.log('initial model', props.model);
  const store = configureStore({
    reducer: props.reducer,
    // preloadedState: props.transform(props.model),
    preloadedState: props.model,
  });

  console.log('initial store state', store.getState());

  store.subscribe(() => {
    console.log('about to call onEdit with state', store.getState());
    // props.onEdit(props.untransform(store.getState()));
    props.onEdit(store.getState());
  });
  return (
    <Provider store={store}>
      <ActivityContext.Provider value={{ ...props }}>{props.children}</ActivityContext.Provider>
    </Provider>
  );
}
