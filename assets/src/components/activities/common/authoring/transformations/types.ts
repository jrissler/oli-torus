import { Identifiable } from 'data/content/model';
import guid from 'utils/guid';

export enum IOperation {
  'shuffle' = 'shuffle',
}
export interface ITransformation extends Identifiable {
  path: string;
  operation: IOperation;
}
export interface HasTransformations {
  authoring: {
    transformations: ITransformation[];
  };
}

export const makeTransformation = (path: string, operation: IOperation): ITransformation => ({
  id: guid(),
  path: 'choices',
  operation,
});
