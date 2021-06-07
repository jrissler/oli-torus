import { EntityState } from '@reduxjs/toolkit';
import { ID, Identifiable, ModelElement, Selection } from 'data/content/model';
import { ResourceContext } from 'data/content/resource';
import { ResourceId } from 'data/types';

export type ChoiceId = ID;
export type ResponseId = ID;
export type HintId = ID;

export type RichText = {
  model: ModelElement[];
  selection: Selection;
};

export interface Success {
  type: 'success';
}

export interface HasContent {
  content: RichText;
}

export interface StudentResponse {
  input: any;
}

export type ModeSpecification = {
  element: string;
  entry: string;
};

export type PartResponse = {
  attemptGuid: string;
  response: StudentResponse;
};

export type ClientEvaluation = {
  attemptGuid: string;
  score: number | null;
  outOf: number | null;
  response: any;
  feedback: any;
};

export type Manifest = {
  id: ID;
  friendlyName: string;
  description: string;
  delivery: ModeSpecification;
  authoring: ModeSpecification;
};

export interface ActivityModelSchema {
  resourceId?: number;
  authoring?: any;
  content?: any;
  activityType?: any;
  id?: string; // maybe slug
}

export interface PartState {
  attemptGuid: string;
  attemptNumber: number;
  dateEvaluated: Date | null;
  score: number | null;
  outOf: number | null;
  response: any;
  feedback: any;
  hints: [];
  partId: string | number;
  hasMoreAttempts: boolean;
  hasMoreHints: boolean;
  error?: string;
}

export interface ActivityState {
  activityId?: ResourceId;
  attemptGuid: string;
  attemptNumber: number;
  dateEvaluated: Date | null;
  score: number | null;
  outOf: number | null;
  parts: PartState[];
  hasMoreAttempts: boolean;
  hasMoreHints: boolean;
  snapshot?: any;
}

export interface ContentItem extends Identifiable, HasContent {}

export type Choice = ContentItem;
export interface HasChoices {
  choices: Choice[];
}

export type Stem = ContentItem;
export interface HasStem {
  stem: Stem;
}

export type Hint = ContentItem;
export type HasHints = HasParts;

export type ChoiceIdsToResponseId = [ChoiceId[], ResponseId];

// Targeted feedback works like this:
// `correct` holds the correct choice ids that map to the single correct response id.
// `incorrect` holds the incorrect choice ids that map to the single catch-all incorrect response id.
// `targeted` holds the choice ids that correspond to a specific targeted feedback response id (there may be multiple). An empty array means there is no targeted feedback, but the targeted feedback mode is "on." `targeted` being undefined means targeted feedback mode is off.
// `CorrectAndIncorrectResponseMappings` has dependencies on `Parts` and `Choices` that the ids correspond to.
type TargetedFeedbackBase = HasChoices &
  HasParts & {
    authoring: {
      feedback: {
        type: 'TargetedFeedbackEnabled' | 'TargetedFeedbackDisabled';
        correct: ChoiceIdsToResponseId;
        incorrect: ChoiceIdsToResponseId;
        targeted: ChoiceIdsToResponseId[];
      };
    };
  };
export type TargetedFeedbackEnabled = TargetedFeedbackBase & {
  authoring: {
    feedback: {
      type: 'TargetedFeedbackEnabled';
    };
  };
};
export type TargetedFeedbackDisabled = TargetedFeedbackBase & {
  authoring: {
    feedback: {
      type: 'TargetedFeedbackDisabled';
    };
  };
};
export type HasTargetedFeedback = TargetedFeedbackEnabled | TargetedFeedbackDisabled;

export const isTargetedFeedbackEnabled = (
  model: HasTargetedFeedback,
): model is TargetedFeedbackEnabled => model.authoring.feedback.type === 'TargetedFeedbackEnabled';

export type Feedback = ContentItem;
export interface Transformation extends Identifiable {
  path: string;
  operation: Operation;
}
export interface HasTransformations {
  authoring: {
    transformations: Transformation[];
  };
}

export interface HasPreviewText {
  authoring: {
    previewText: string;
  };
}

export type Rule = string;
export interface Response extends Identifiable {
  // see `parser.ex` and `rule.ex`
  rule: Rule;
  // `score >= 0` indicates the feedback corresponds to a correct choice
  score: number;
  feedback: Feedback;
}

export interface ConditionalOutcome extends Identifiable {
  // eslint-disable-next-line
  rule: Object;
  actions: ActionDesc[];
}

export interface IsAction {
  attempt_guid: string;
  error?: string;
}

export type Action = NavigationAction | FeedbackAction | StateUpdateAction;
export type ActionDesc = NavigationActionDesc | FeedbackActionDesc | StateUpdateActionDesc;

export interface FeedbackActionCore {
  score: number;
  feedback: Feedback;
}

export interface NavigationActionCore {
  to: string;
}

export interface StateUpdateActionCore {
  // eslint-disable-next-line
  update: Object;
}

export interface NavigationActionDesc extends Identifiable, NavigationActionCore {
  type: 'NavigationActionDesc';
}

export interface NavigationAction extends NavigationActionCore, IsAction {
  type: 'NavigationAction';
}

export interface FeedbackActionDesc extends Identifiable, FeedbackActionCore {
  type: 'FeedbackActionDesc';
}

export interface FeedbackAction extends FeedbackActionCore, IsAction {
  type: 'FeedbackAction';
  out_of: number;
}

export interface StateUpdateActionDesc extends Identifiable, StateUpdateActionCore {
  type: 'StateUpdateActionDesc';
}

export interface StateUpdateAction extends StateUpdateActionCore, IsAction {
  type: 'StateUpdateAction';
}

export interface Part extends Identifiable {
  responses: Response[];
  outcomes?: ConditionalOutcome[];
  hints: Hint[];
  scoringStrategy: ScoringStrategy;
}
export interface HasParts {
  authoring: {
    parts: Part[];
  };
}

export enum ScoringStrategy {
  'average' = 'average',
  'best' = 'best',
  'most_recent' = 'most_recent',
}

export enum EvaluationStrategy {
  'regex' = 'regex',
  'numeric' = 'numeric',
  'none' = 'none',
}

export enum Operation {
  'shuffle' = 'shuffle',
}
// eslint-disable-next-line
export interface CreationContext extends ResourceContext {}

export interface PartComponentDefinition {
  id: string;
  type: string;
  custom: Record<string, any>;
}
