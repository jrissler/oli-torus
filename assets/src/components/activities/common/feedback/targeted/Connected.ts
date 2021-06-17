import { ChoiceId, RichText } from 'components/activities/types';
import { connect } from 'react-redux';
import { Unconnected } from './Unconnected';
import { feedbackSlice } from '../slice';
import { ID } from 'data/content/model';
import { selectAllChoices } from '../../choices/authoring/slice';
import { makeResponse } from '../../authoring/responses/types';
import { makeEmptyRule } from 'components/activities/ordering/utils';
import {
  HasResponseMappings,
  responseMappingSlice,
  selectResponseMappingsByPartId,
} from '../../authoring/responseChoices/responseChoicesSlice';
import { selectResponseById } from '../../authoring/parts/slice';
import { HasParts } from '../../authoring/parts/types';
import { responsesSlice } from '../../authoring/responses/slice';

export const Connected = connect(
  (state: HasParts & HasResponseMappings, ownProps: { partId: ID }) => {
    return {
      choices: selectAllChoices(state),
      targetedMappings: selectResponseMappingsByPartId(state, ownProps.partId).targeted.map(
        (mapping) => ({
          response: selectResponseById(state, mapping.responseId),
          choiceIds: mapping.choiceIds,
        }),
      ),
    };
  },
  (dispatch, ownProps) => ({
    toggleChoice: (choiceId: ChoiceId, responseId: ID) =>
      dispatch(
        responseMappingSlice.actions.toggleChoice({
          partId: ownProps.partId,
          choiceId,
          responseId,
        }),
      ),
    updateFeedback: (id: ID, content: RichText) =>
      dispatch(feedbackSlice.actions.update({ partId: ownProps.partId, id, changes: { content } })),
    addTargetedResponse: (response = makeResponse(makeEmptyRule(), 0, '')) => {
      dispatch(
        responseMappingSlice.actions.addTargetedResponse({
          partId: '1',
          responseId: response.id,
        }),
      );
      dispatch(responsesSlice.actions.addOne({ partId: ownProps.partId, response }));
    },
  }),
)(Unconnected);
