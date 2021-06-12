import { ContentItem } from 'components/activities/types';
import { HasParts } from '../authoring/parts/types';
import { makeContent } from '../authoring/utils';

export type IHint = ContentItem;
export type HasHints = HasParts;
export const makeHint: (text: string) => IHint = makeContent;
