import { Identifiable } from 'data/content/model';
import { FeedbackAction, FeedbackActionDesc } from '../../feedback/simple/types';
import { IHint } from '../../hints/types';
import { IResponse } from '../responses/types';

export interface NavigationActionCore {
  to: string;
}

export interface StateUpdateActionCore {
  // eslint-disable-next-line
  update: Object;
}

export interface IsAction {
  attempt_guid: string;
  error?: string;
}

export interface NavigationActionDesc extends Identifiable, NavigationActionCore {
  type: 'NavigationActionDesc';
}

export interface NavigationAction extends NavigationActionCore, IsAction {
  type: 'NavigationAction';
}

export interface StateUpdateActionDesc extends Identifiable, StateUpdateActionCore {
  type: 'StateUpdateActionDesc';
}

export interface StateUpdateAction extends StateUpdateActionCore, IsAction {
  type: 'StateUpdateAction';
}

export enum ScoringStrategy {
  'average' = 'average',
  'best' = 'best',
  'most_recent' = 'most_recent',
}

export type Action = NavigationAction | FeedbackAction | StateUpdateAction;
export type ActionDesc = NavigationActionDesc | FeedbackActionDesc | StateUpdateActionDesc;
export interface ConditionalOutcome extends Identifiable {
  // eslint-disable-next-line
  rule: Object;
  actions: ActionDesc[];
}
export interface IPart extends Identifiable {
  responses: IResponse[];
  outcomes?: ConditionalOutcome[];
  hints: IHint[];
  scoringStrategy: ScoringStrategy;
}
export interface HasParts {
  authoring: {
    parts: IPart[];
  };
}
