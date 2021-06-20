import { combineReducers, Reducer } from '@reduxjs/toolkit';
import { ActivityModelSchema } from 'data/content/activities/activity';
import React, { useContext } from 'react';
import { Provider } from 'react-redux';
import { RootAppState, rootReducer } from 'state';
import { initialState } from 'state/preferences';
import { configureStore } from 'state/store';
import { AuthoringElementProps } from './AuthoringElement';

export const ActivityContext: React.Context<
  AuthoringElementProps<ActivityModelSchema> | undefined
> = React.createContext<AuthoringElementProps<ActivityModelSchema> | undefined>(undefined);

export function useActivityContext() {
  const context = useContext<AuthoringElementProps<ActivityModelSchema> | undefined>(
    ActivityContext,
  );
  if (context === undefined) {
    throw new Error('useActivityContext must be used within an ActivityProvider');
  }
  return context;
}

export type RootActivityState<T = ActivityModelSchema> = { app: RootAppState; model: T };
interface ActivityProviderProps<Model extends ActivityModelSchema>
  extends AuthoringElementProps<Model> {
  children: React.ReactNode;
  modelReducer: Reducer<Model>;
}
export const ActivityProvider = <T,>(props: ActivityProviderProps<T>) => {
  // const store = configureStore(props.model, props.modelReducer, 'Activity Model');
  const store = configureStore(props.model, props.modelReducer);

  console.log('initial store state', store.getState());

  store.subscribe(() => {
    console.log('about to call onEdit with state', store.getState());
    props.onEdit(store.getState());
  });
  return (
    <Provider store={store}>
      <ActivityContext.Provider value={{ ...props }}>{props.children}</ActivityContext.Provider>
    </Provider>
  );
};
