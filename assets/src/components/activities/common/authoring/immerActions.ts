import {
  canMoveChoiceDown,
  canMoveChoiceUp,
  ChoiceMoveDirection,
  getChoice,
  getChoiceIndex,
  getHint,
  getResponse,
  isShuffled,
  isTargetedFeedbackEnabled,
  makeChoice,
  makeHint,
  transformation,
} from 'components/activities/common/authoring/utils';
import {
  Choice,
  ChoiceId,
  HasChoices,
  HasParts,
  HasStem,
  HasTargetedFeedback,
  HasTransformations,
  Operation,
  Response,
  RichText,
} from 'components/activities/types';
import { toSimpleText } from 'data/content/text';

export const toggleTargetedFeedback = () => {
  return (model: { authoring: HasTargetedFeedback }) => {
    if (isTargetedFeedbackEnabled(model)) {
      model.authoring.targetedFeedback = undefined;
      return;
    }
    model.authoring.targetedFeedback = [];
  };
};

export const editStem = (content: RichText) => {
  return (model: HasStem & { authoring: { previewText: string } }) => {
    model.stem.content = content;
    model.authoring.previewText = toSimpleText({ children: content.model });
  };
};

// Only for activities with one part
export const addChoice = () => {
  return (model: HasChoices & { authoring: HasParts }) => {
    model.choices.push(makeChoice(''));
  };
};

export const editChoice = (id: string, content: RichText) => {
  return (model: HasChoices) => {
    getChoice(model, id).content = content;
  };
};

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
export const removeChoice = (responsePredicate: (response: Response, id: ChoiceId) => boolean) => (
  id: ChoiceId,
) => {
  return (model: HasChoices & { authoring: HasParts }) => {
    model.choices = model.choices.filter((c) => c.id !== id);
    model.authoring.parts[0].responses = model.authoring.parts[0].responses.filter((response) =>
      responsePredicate(response, id),
    );
  };
};

export const editFeedback = (id: string, content: RichText) => {
  return (model: { authoring: HasParts }) => {
    getResponse(model, id).feedback.content = content;
  };
};

// Only for activities with one part
export const addHint = () => {
  return (model: { authoring: HasParts }) => {
    // new hints are always cognitive hints. they should be inserted
    // right before the bottomOut hint at the end of the list
    const bottomOutIndex = model.authoring.parts[0].hints.length - 1;
    model.authoring.parts[0].hints.splice(bottomOutIndex, 0, makeHint(''));
  };
};

export const editHint = (id: string, content: RichText) => {
  return (model: { authoring: HasParts }) => {
    getHint(model, id).content = content;
  };
};

// Only for activities with one part
export const removeHint = (id: string) => {
  return (model: { authoring: HasParts }) => {
    model.authoring.parts[0].hints = model.authoring.parts[0].hints.filter((h) => h.id !== id);
  };
};

export const toggleAnswerChoiceShuffling = () => {
  return (model: { authoring: HasTransformations }) => {
    const transformations = model.authoring.transformations;

    isShuffled(transformations)
      ? (model.authoring.transformations = transformations.filter(
          (xform) => xform.operation !== Operation.shuffle,
        ))
      : model.authoring.transformations.push(transformation('choices', Operation.shuffle));
  };
};
