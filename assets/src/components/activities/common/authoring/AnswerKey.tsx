import React from 'react';
import { defaultWriterContext } from 'data/content/writers/context';

import {
  Choice,
  ChoiceId,
  HasChoices,
  HasStem,
  HasTargetedFeedback,
  Stem as StemType,
} from 'components/activities/types';
import { Choices } from '../choices';
import { getCorrectChoiceIds } from './feedback/TargetedFeedback';
import { connect } from 'react-redux';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { makeStem } from './utils';

interface Props {
  stem: StemType;
  choices: Choice[];
  correctChoiceIds: ChoiceId[];
  onToggleCorrectness: (id: ChoiceId) => void;
}
export const AuthoringAnswerKey: React.FC<Props> = ({
  stem,
  choices,
  correctChoiceIds,
  onToggleCorrectness,
}) => {
  return (
    <>
      {/* <Stem.Delivery stem={stem} context={defaultWriterContext()} /> */}

      <Choices.Delivery
        unselectedIcon={<i className="material-icons-outlined">check_box_outline_blank</i>}
        selectedIcon={<i className="material-icons-outlined">check_box</i>}
        choices={choices}
        selected={correctChoiceIds}
        onSelect={onToggleCorrectness}
        isEvaluated={false}
        context={defaultWriterContext()}
      />
    </>
  );
};

