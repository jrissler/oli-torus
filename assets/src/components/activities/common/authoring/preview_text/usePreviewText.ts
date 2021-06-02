import { useAuthoringElementContext } from 'components/activities/AuthoringElement';
import { toSimpleText } from 'components/editing/utils';
import { HasPreviewText, RichText } from 'components/activities/types';
import produce from 'immer';

export function usePreviewText() {
  const {
    model: {
      authoring: { previewText },
    },
    dispatch,
  } = useAuthoringElementContext<HasPreviewText>();

  const setPreviewText = (content: RichText) =>
    produce((draft: HasPreviewText) => {
      draft.authoring.previewText = toSimpleText({ children: content.model });
    });

  return { previewText, setPreviewText, dispatch };
}
