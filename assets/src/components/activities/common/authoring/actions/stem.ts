import { RichText } from 'data/content/activities/activity';
import { toSimpleText } from 'components/editing/utils';
import { HasStem } from 'data/content/activities/stem';
import { HasPreviewText } from 'data/content/activities/previewText';

export const editStem = (content: RichText) => {
  return (model: HasStem & HasPreviewText) => {
    model.stem.content = content;
    model.authoring.previewText = toSimpleText({ children: content.model });
  };
};
