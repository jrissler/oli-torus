import { ActivityModelSchema } from './types';
import { ProjectSlug } from 'data/types';
import React, { Reducer, useContext, useEffect, useMemo, useReducer } from 'react';
import { ActivityEditorMap } from 'data/content/editors';
import produce from 'immer';
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';

export function orIdentity(f: unknown) {
  if (typeof f === 'function') {
    return f;
  }
  return (..._args: unknown[]) =>
    (model: unknown) =>
      model;
}

export const AuthoringElementContext: React.Context<AuthoringElementProps<IModel> | undefined> =
  React.createContext<AuthoringElementProps<IModel> | undefined>(undefined);

export function useAuthoringElementContext<IModel>() {
  const context = useContext<AuthoringElementProps<IModel> | undefined>(AuthoringElementContext);
  if (context === undefined) {
    throw new Error('useAuthoringElementContext must be used within an ActivityProvider');
  }
  return context;
}

export interface AuthoringElementProps<T extends ActivityModelSchema> {
  model: T;
  onEdit: (model: T) => void;
  editMode: boolean;
  projectSlug: ProjectSlug;
  editorMap: ActivityEditorMap;
}

// An abstract authoring web component, designed to delegate to
// a React authoring component.  This authoring web component will re-render
// the underlying React component when the 'model' attribute of the
// the web component changes.  It also traps onEdit callbacks from the
// React component and translates these calls into dispatches of the
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
    const onEdit = (model: T) =>
      this.dispatchEvent(new CustomEvent('modelUpdated', { bubbles: true, detail: { model } }));

    return {
      onEdit,
      model,
      editMode,
      projectSlug,
      editorMap,
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
