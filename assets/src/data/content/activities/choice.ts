import { makeContent } from 'components/activities/common/authoring/utils';
import { ContentItem } from 'data/content/activities/activity';

export const makeChoice: (text: string) => IChoice = makeContent;
export type IChoice = ContentItem;
export interface HasChoices {
  choices: IChoice[];
}
