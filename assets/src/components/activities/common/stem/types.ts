import { ContentItem } from 'components/activities/types';
import { makeContent } from '../authoring/utils';

export type IStem = ContentItem;
export type UIStem = IStem;
export interface HasStem {
  stem: IStem;
}
export const makeStem: (text: string) => IStem = makeContent;
