import { Update } from '@reduxjs/toolkit';
import { ID, Identifiable } from 'data/content/model';
import { Maybe } from 'tsmonad';

export const findById = <Entity extends Identifiable>(state: Entity[], idToFind: string | number) =>
  Maybe.maybe(state.find(({ id }) => id === idToFind)).valueOrThrow(
    new Error('findById could not find entity with id ' + idToFind),
  );

export const addOne = <Entity extends Identifiable>(state: Entity[], entity: Entity) => {
  state.push(entity);
};

export const setAll = <Entity extends Identifiable>(state: Entity[], newState: Entity[]) => {
  return newState;
};

export const update = <Entity extends Identifiable>(state: Entity, changes: Partial<Entity>) =>
  Object.assign(state, changes);

export const updateOne = <Entity extends Identifiable>(state: Entity[], update: Update<Entity>) => {
  Object.assign(findById(state, update.id), update.changes);
};
export const removeOne = <Entity extends Identifiable>(state: Entity[], id: ID) => {
  return state.filter((s) => s.id !== id);
};
