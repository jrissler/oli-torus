import { HasPreviewText, HasStem, RichText } from 'components/activities/types';
import { toSimpleText } from 'components/editing/utils';

export const editStem = (content: RichText) => {
  return (model: HasStem & HasPreviewText) => {
    model.stem.content = content;
    model.authoring.previewText = toSimpleText({ children: content.model });
  };
};
