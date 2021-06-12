import React from 'react';
import { ResponseId, RichText } from 'components/activities/types';
import { connect } from 'react-redux';
import { Unconnected } from './Unconnected';
import { feedbackSlice } from '../slice';
import { HasParts } from '../../authoring/parts/types';

export const Connected: React.FC = connect(
  (state: HasParts) => {
    const getCorrectResponse = (model: HasParts) =>
      model.authoring.parts[0].responses.find((r) => r.score === 1);
    const getIncorrectResponse = (model: HasParts) =>
      model.authoring.parts[0].responses.find((r) => r.score === 0);

    return {
      correctResponse: getCorrectResponse(state),
      incorrectResponse: getIncorrectResponse(state),
    };
  },
  (dispatch) => ({
    update: (responseId: ResponseId, content: RichText) =>
      dispatch(feedbackSlice.actions.update({ partId: '1', responseId, changes: { content } })),
  }),
)(Unconnected);
