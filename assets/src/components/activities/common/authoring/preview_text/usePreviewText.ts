import { useAuthoringElementContext } from 'components/activities/AuthoringElement';
import { toSimpleText } from 'components/editing/utils';
import { HasPreviewText, RichText } from 'components/activities/types';

// type PreviewTextActions = { type: 'EDIT_PREVIEW_TEXT'; content: RichText | string };

export function usePreviewText() {
  const { model, dispatch } = useAuthoringElementContext<HasPreviewText>();

  const setPreviewText = (content: RichText) =>
    dispatch((draft: HasPreviewText) => {
      draft.authoring.previewText = toSimpleText({ children: content.model });
    });

  return { previewText: model.authoring.previewText, setPreviewText };
}
