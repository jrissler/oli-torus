import { getHint, makeHint } from 'components/activities/common/authoring/utils';
import { HasParts, RichText } from 'components/activities/types';

// Only for activities with one part
export const addHint = () => {
  return (model: HasParts) => {
    // new hints are always cognitive hints. they should be inserted
    // right before the bottomOut hint at the end of the list
    const bottomOutIndex = model.authoring.parts[0].hints.length - 1;
    model.authoring.parts[0].hints.splice(bottomOutIndex, 0, makeHint(''));
  };
};

export const editHint = (id: string, content: RichText) => {
  return (model: HasParts) => {
    getHint(model, id).content = content;
  };
};

// Only for activities with one part
export const removeHint = (id: string) => {
  return (model: HasParts) => {
    model.authoring.parts[0].hints = model.authoring.parts[0].hints.filter((h) => h.id !== id);
  };
};
