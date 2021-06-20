import { ID, Identifiable, ModelElement, Selection } from 'data/content/model';
import { ResourceContext } from 'data/content/resource';
import { ResourceId } from 'data/types';

export type ChoiceId = ID;
export type ResponseId = ID;
export type HintId = ID;
export type PartId = ID;
export type StemId = ID;

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

// eslint-disable-next-line
export interface CreationContext extends ResourceContext {}

export interface PartComponentDefinition {
  id: string;
  type: string;
  custom: Record<string, any>;
}
