import { RichText } from 'components/activities/types';
import { connect } from 'react-redux';
import { Unconnected } from './Unconnected';
import { feedbackSlice } from '../slice';
import { ID } from 'data/content/model';
import {
  HasResponseMappings,
  selectResponseMappingsByPartId,
} from '../../authoring/responseChoices/responseChoicesSlice';
import { selectFeedbackByResponseId } from '../../authoring/parts/slice';

export const Connected = connect(
  (state: HasResponseMappings, ownProps: { partId: ID }) => {
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
