import guid from 'utils/guid';
import { ID, Identifiable } from '../model';
import { PartId } from './activity';
import { IFeedback, makeFeedback } from './feedback';

export type IRule = string;
export interface IResponse extends Identifiable {
  // see `parser.ex` and `rule.ex`
  rule: IRule;
  // `score >= 0` indicates the feedback corresponds to a correct choice
  score: number;
  feedback: IFeedback;
}

export const makeResponse = (rule: string, score: number, text: ''): IResponse => ({
  id: guid(),
  rule,
  score,
  feedback: makeFeedback(text),
});

export interface UIResponse extends Identifiable {
  partId: PartId;
  rule: IRule;
  score: number;
  feedback: ID;
}
