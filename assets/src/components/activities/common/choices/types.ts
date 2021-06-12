import { ContentItem } from 'components/activities/types';
import { makeContent } from '../authoring/utils';

export const makeChoice: (text: string) => IChoice = makeContent;
export type IChoice = ContentItem;
export interface HasChoices {
  choices: IChoice[];
}
