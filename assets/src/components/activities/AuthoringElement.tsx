import { ActivityModelSchema } from './types';
import { ProjectSlug } from 'data/types';
import React, { Reducer, useContext, useEffect, useReducer } from 'react';
import { ActivityEditorMap } from 'data/content/editors';
import produce from 'immer';

export const combineReducers = (reducers) => {
  return (state, action) => {
    return Object.keys(reducers).reduce((acc, prop) => {
      return {
        ...acc,
        ...reducers[prop]({ [prop]: acc[prop] }, action),
      };
    }, state);
  };
};

export interface AuthoringElementProps<T extends ActivityModelSchema> {
  model: T;
  onEdit: (model: T) => void;
  editMode: boolean;
  projectSlug: ProjectSlug;
  editorMap: ActivityEditorMap;
  dispatch: (action: (model: T) => void) => boolean
}

export const AuthoringElementContext =
  React.createContext<AuthoringElementProps<any> | undefined>(undefined);

export function useAuthoringElementContext<T>() {
  const context = useContext<AuthoringElementProps<T> | undefined>(AuthoringElementContext);
  if (context === undefined) {
    throw new Error('useAuthoringElementContext must be used within an AuthoringElementProvider');
  }
  return context;
}

// export const AuthoringElementProvider: React.FC<AuthoringElementProps> = ({ reducer, initialState = {}, children }) => {
//   const value = React.useReducer(reducer, initialState);
//   return (
//     <AuthoringElementContext.Provider value={value}>
//       {props.children}
//     </AuthoringElementContext.Provider>
//   );
// }

// An abstract authoring web component, designed to delegate to
// a React authoring component.  This authoring web component will re-render
// the underlying React component when the 'model' attribute of the
// the web component changes.  It also traps onEdit callbacks from the
// React component and translated these calls into dispatches of the
// 'modelUpdated' CustomEvent.  It is this CustomEvent that is handled by
// Torus to process updates from the authoring web component.
export abstract class AuthoringElement<T extends ActivityModelSchema> extends HTMLElement {
  mountPoint: HTMLDivElement;
  connected: boolean;

  constructor() {
    super();

    this.mountPoint = document.createElement('div');
  }

  props(): AuthoringElementProps<T> {
    const getProp = (key: string) => JSON.parse(this.getAttribute(key) as any);
    const model = getProp('model');
    const editMode: boolean = getProp('editMode');
    const projectSlug: ProjectSlug = this.getAttribute('projectSlug') as string;
    const editorMap: ActivityEditorMap = getProp('editorMap');
    const onEdit = (model: unknown) =>
      this.dispatchEvent(new CustomEvent('modelUpdated', { bubbles: true, detail: { model } }));
    const dispatch = (action: (model: T) => void) => onEdit(produce(model, action));
    // onEdit = (action: any) => onEdit(produce(model, action));

    return {
      onEdit,
      model,
      editMode,
      projectSlug,
      editorMap,
      dispatch,
    };
  }

  abstract render(mountPoint: HTMLDivElement, props: AuthoringElementProps<T>): void;

  connectedCallback() {
    this.appendChild(this.mountPoint);
    this.render(this.mountPoint, this.props());
    this.connected = true;
  }

  attributeChangedCallback(name: unknown, oldValue: unknown, newValue: unknown) {
    if (this.connected) {
      this.render(this.mountPoint, this.props());
    }
  }

  static get observedAttributes() {
    return ['model', 'editMode'];
  }
}
