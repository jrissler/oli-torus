import { RichText } from 'components/activities/types';
import { toSimpleText } from 'components/editing/utils';
import {  HasStem  } from '../../stem/types';;
import {  HasPreviewText  } from '../preview_text/types';;

export const editStem = (content: RichText) => {
  return (model: HasStem & HasPreviewText) => {
    model.stem.content = content;
    model.authoring.previewText = toSimpleText({ children: content.model });
  };
};
