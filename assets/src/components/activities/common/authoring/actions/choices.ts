import {
  canMoveChoiceDown,
  canMoveChoiceUp,
  ChoiceMoveDirection,
  getChoice,
  getChoiceIndex,
  isShuffled,
} from 'components/activities/common/authoring/utils';
import { makeTransformation } from 'components/activities/common/utils';
import { ChoiceId, RichText } from 'data/content/activities/activity';
import { HasChoices, IChoice, makeChoice } from 'data/content/activities/choice';
import { HasParts } from 'data/content/activities/part';
import { IResponse } from 'data/content/activities/response';
import { HasTransformations, IOperation } from 'data/content/activities/transformation';

// Only for activities with one part
export const addChoice = () => {
  return (model: HasChoices & HasParts) => {
    model.choices.push(makeChoice(''));
  };
};

export const editChoice = (id: ChoiceId, content: RichText) => (model: HasChoices) =>
  (getChoice(model, id).content = content);

export const editChoices = (choices: IChoice[]) => (model: HasChoices) => (model.choices = choices);

export const moveChoice = (direction: ChoiceMoveDirection, id: ChoiceId) => {
  return (model: HasChoices) => {
    const thisChoiceIndex = getChoiceIndex(model, id);

    const swap = (index1: number, index2: number) => {
      const temp = model.choices[index1];
      model.choices[index1] = model.choices[index2];
      model.choices[index2] = temp;
    };
    const moveUp = () => swap(thisChoiceIndex, thisChoiceIndex - 1);
    const moveDown = () => swap(thisChoiceIndex, thisChoiceIndex + 1);

    switch (direction) {
      case 'up':
        return canMoveChoiceUp(model, id) ? moveUp() : model;
      case 'down':
        return canMoveChoiceDown(model, id) ? moveDown() : model;
    }
  };
};

// Only for activities with one part
export const removeChoice =
  (responsePredicate: (response: IResponse, id: ChoiceId) => boolean) => (id: ChoiceId) => {
    return (model: HasChoices & HasParts) => {
      model.choices = model.choices.filter((c) => c.id !== id);
      model.authoring.parts[0].responses = model.authoring.parts[0].responses.filter((response) =>
        responsePredicate(response, id),
      );
    };
  };

export const toggleAnswerChoiceShuffling = () => {
  return (model: HasTransformations) => {
    const transformations = model.authoring.transformations;

    isShuffled(transformations)
      ? (model.authoring.transformations = transformations.filter(
          (xform) => xform.operation !== IOperation.shuffle,
        ))
      : model.authoring.transformations.push(makeTransformation('choices', IOperation.shuffle));
  };
};
