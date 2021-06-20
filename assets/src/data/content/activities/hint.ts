import { makeContent } from 'components/activities/common/authoring/utils';
import { ContentItem, HintId } from 'data/content/activities/activity';
import { ID } from 'data/content/model';
import { HasParts } from './part';

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
