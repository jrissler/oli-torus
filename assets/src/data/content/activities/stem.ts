import { makeContent } from 'components/activities/common/authoring/utils';
import { ContentItem } from 'data/content/activities/activity';

export type IStem = ContentItem;
export type UIStem = IStem;
export interface HasStem {
  stem: IStem;
}
export const makeStem: (text: string) => IStem = makeContent;
