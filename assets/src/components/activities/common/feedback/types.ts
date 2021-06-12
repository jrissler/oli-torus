import { ContentItem } from 'components/activities/types';
import { Identifiable } from 'data/content/model';
import { IsAction } from '../authoring/parts/types';
import { makeContent } from '../authoring/utils';

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
