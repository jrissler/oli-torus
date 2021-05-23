import { ActivityModelSchema } from './types';
import { ProjectSlug } from 'data/types';
import React, { useContext, useEffect, useReducer } from 'react';
import { ActivityEditorMap } from 'data/content/editors';
import produce from 'immer';

export interface AuthoringElementProps<T extends ActivityModelSchema> {
  model: T;
  onEdit: (model: T) => void;
  editMode: boolean;
  projectSlug: ProjectSlug;
  editorMap: ActivityEditorMap;
  dispatch: any;
}

export const AuthoringElementContext = React.createContext<AuthoringElementProps<any> | undefined>(
  undefined,
);

export function useAuthoringElementContext<T>(reducer: any) {
  const context = useContext<AuthoringElementProps<T> | undefined>(AuthoringElementContext);
  console.log('context', context)
  if (context === undefined) {
    throw new Error('useAuthoringElementContext must be used within an AuthoringElementProvider');
  }
  const [model, dispatch] = useReducer(produce(reducer), context.model)

  return Object.assign(context, model, dispatch);
}

// export function AuthoringElementProvider(props: any) {
//   console.log('props', props)
//   const [model, dispatch] = React.useReducer(props.reducer, {});
//   console.log('cache', model)
//     useEffect(() => {
//     // console.log('new model in authoringelement', cache.model)
//     // cache.onEdit(cache.model);
//   }, [props.model])
//   return <AuthoringElementContext.Provider value={Object.assign(props.value, dispatch, model)} {...props.children} />;
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
    const onEdit = (model: any) =>
      this.dispatchEvent(new CustomEvent('modelUpdated', { bubbles: true, detail: { model } }));
    // const dispatch = (action: (model: T) => void) => onEdit(produce(model, action));
    // onEdit = (action: any) => onEdit(produce(model, action));

    return {
      onEdit,
      model,
      editMode,
      projectSlug,
      editorMap,
      dispatch: () => undefined,
    };
  }

  abstract render(mountPoint: HTMLDivElement, props: AuthoringElementProps<T>): void;

  connectedCallback() {
    this.appendChild(this.mountPoint);
    this.render(this.mountPoint, this.props());
    this.connected = true;
  }

  attributeChangedCallback(name: any, oldValue: any, newValue: any) {
    if (this.connected) {
      this.render(this.mountPoint, this.props());
    }
  }

  static get observedAttributes() {
    return ['model', 'editMode'];
  }
}
