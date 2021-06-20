import { RichText } from 'data/content/activities/activity';
import { connect } from 'react-redux';
import { Unconnected } from './Unconnected';
import { feedbackSlice } from '../slice';
import { ID } from 'data/content/model';
import {
  HasResponseMappings,
  selectResponseMappingsByPartId,
} from '../../authoring/responseChoices/responseChoicesSlice';
import { selectFeedbackByResponseId } from '../../authoring/parts/slice';
import { HasParts } from 'data/content/activities/part';

export const Connected = connect(
  (state: HasParts & HasResponseMappings, ownProps: { partId: ID }) => {
    return {
      correctFeedback: selectFeedbackByResponseId(
        state,
        selectResponseMappingsByPartId(state, ownProps.partId).correct.responseId,
      ),
      incorrectFeedback: selectFeedbackByResponseId(
        state,
        selectResponseMappingsByPartId(state, ownProps.partId).incorrect.responseId,
      ),
    };
  },
  (dispatch, ownProps) => ({
    update: (id: ID, content: RichText) =>
      dispatch(feedbackSlice.actions.update({ partId: ownProps.partId, id, changes: { content } })),
  }),
)(Unconnected);
