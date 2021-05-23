import { useAuthoringElementContext } from 'components/activities/AuthoringElement';
import { HasPreviewText, RichText } from 'components/activities/types';
import { toSimpleText } from 'components/editing/utils';
import produce from 'immer';
import { useReducer } from 'react';

type PreviewTextActions = { type: 'EDIT_PREVIEW_TEXT'; content: RichText | string };

export function previewTextReducer(draft: HasPreviewText, action: PreviewTextActions) {
  switch (action.type) {
    case 'EDIT_PREVIEW_TEXT': {
      draft.authoring.previewText =
        typeof action.content === 'string'
          ? action.content
          : toSimpleText({ children: action.content.model });
      break;
    }
  }
}

export function usePreviewText({ reducer = previewTextReducer } = {}) {
  const { model } = useAuthoringElementContext<HasPreviewText>();
  const [state, dispatch] = useReducer(
    produce(reducer),
    model || { authoring: { previewText: '' } },
  );
  const setPreviewText = (content: string | RichText) =>
    dispatch({ type: 'EDIT_PREVIEW_TEXT', content });

  return { previewText: state.authoring.previewText, setPreviewText };
}
