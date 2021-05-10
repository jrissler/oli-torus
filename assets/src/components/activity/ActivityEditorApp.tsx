import React from 'react';
import ReactDOM from 'react-dom';
import { ActivityEditor } from './ActivityEditor';
import { ModalDisplay } from 'components/modal/ModalDisplay';
import { Provider } from 'react-redux';
import { Maybe } from 'tsmonad';
import { configureStore } from 'state/store';
import { b64DecodeUnicode } from 'utils/decode';

let store = configureStore();

(window as any).oliMountApplication = (mountPoint: any, paramString: any) => {
  const params = JSON.parse(b64DecodeUnicode(paramString));

  console.log('params in ActivityEditorApp.tsx', params);

  ReactDOM.render(
    <Provider store={store}>
      <ActivityEditor {...params} />
      <ModalDisplay />
    </Provider>,
    mountPoint,
  );
};

(window as any).store = {
  configureStore: (json: any) => {
    store = configureStore(json);
  },
};

// Expose other libraries to server-side rendered templates
(window as any).Maybe = Maybe;
