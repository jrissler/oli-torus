import React from 'react';
import { ResponseId, RichText } from 'components/activities/types';
import { connect } from 'react-redux';
import { Unconnected } from './Unconnected';
import { feedbackSlice } from '../slice';
import { HasParts } from '../../authoring/parts/types';
import { CataRootState } from 'components/activities/check_all_that_apply/CheckAllThatApplyAuthoring';
import { ID } from 'data/content/model';
import { selectAllResponsesByPartId } from '../../authoring/parts/slice';

export const Connected: React.FC = connect(
  (state: CataRootState) => {
    const partId = '1';

    return {
      correctFeedback: selectAllResponsesByPartId(partId, state)?.find((r) => r.score === 1)
        ?.feedback,
      incorrectFeedback: selectAllResponsesByPartId(partId, state)?.find((r) => r.score === 0)
        ?.feedback,
    };
  },
  (dispatch) => ({
    update: (id: ID, content: RichText) =>
      dispatch(feedbackSlice.actions.update({ id, changes: { content } })),
  }),
)(Unconnected);
