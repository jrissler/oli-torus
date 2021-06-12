import { PayloadAction, Update } from '@reduxjs/toolkit';
import { ID, Identifiable } from 'data/content/model';

export const findById = <Entity extends Identifiable>(state: Entity[], idToFind: ID) =>
  state.find(({ id }) => id === idToFind);

export const addOne = <Entity extends Identifiable>(
  state: Entity[],
  action: PayloadAction<Entity>,
) => {
  state.push(action.payload);
};

export const setAll = <Entity extends Identifiable>(
  state: Entity[],
  action: PayloadAction<Entity[]>,
) => {
  return action.payload;
};

export const update = <Entity extends Identifiable>(
  state: Entity,
  action: { payload: { changes: Partial<Entity> } },
) => Object.assign(state, action.payload.changes);

export const updateOne = <Entity extends Identifiable>(
  state: Entity[],
  action: { payload: Update<Entity> },
) => {
  Object.assign(
    state.find(({ id }) => id === action.payload.id),
    action.payload.changes,
  );
};
export const removeOne = <Entity extends Identifiable>(
  state: Entity[],
  action: { payload: ID },
) => {
  return state.filter(({ id }) => id !== action.payload);
};
