import { ContentItem, HintId } from 'components/activities/types';
import { ID } from 'data/content/model';
import { HasParts } from '../authoring/parts/types';
import { makeContent } from '../authoring/utils';

export type IHint = ContentItem;
export type HasHints = HasParts;
export const makeHint: (text: string) => IHint = makeContent;

export type UIHint = IHint & { partId: ID };

export interface HintMapping {
  deerInHeadlights: HintId;
  cognitive: HintId[];
  bottomOut: HintId;
}
export interface HintMappings {
  [partId: string]: HintMapping;
}
