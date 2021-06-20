import { makeContent } from 'components/activities/common/authoring/utils';
import { Identifiable } from '../model';
import { ContentItem } from './activity';
import { IsAction } from './part';

export type IFeedback = ContentItem;

export interface FeedbackActionCore {
  score: number;
  feedback: IFeedback;
}

export interface FeedbackActionDesc extends Identifiable, FeedbackActionCore {
  type: 'FeedbackActionDesc';
}

export interface FeedbackAction extends FeedbackActionCore, IsAction {
  type: 'FeedbackAction';
  out_of: number;
}

export const makeFeedback: (text: string) => IFeedback = makeContent;
