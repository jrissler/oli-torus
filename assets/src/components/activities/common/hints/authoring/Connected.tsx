import { connect } from 'react-redux';
import { Unconnected } from 'components/activities/common/hints/authoring/Unconnected';
import { hintsSlice } from './slice';
import { ID } from 'data/content/model';
import { selectAllHintsByPartId } from '../../authoring/parts/slice';
import { HintId, RichText } from 'data/content/activities/activity';
import { HasHints, makeHint } from 'data/content/activities/hint';

export const Connected = connect(
  (state: HasHints, ownProps: { partId: ID }) => {
    const hints = selectAllHintsByPartId(state, ownProps.partId);
    return {
      partId: ownProps.partId,
      deerInHeadlightsHint: hints[0],
      cognitiveHints: hints.slice(1, hints.length - 1),
      bottomOutHint: hints[hints.length - 1],
    };
  },
  (dispatch) => ({
    addOne: (partId: ID) => () =>
      dispatch(hintsSlice.actions.addOne({ hint: makeHint(''), partId })),
    updateOne: (partId: ID) => (id: HintId, content: RichText) =>
      dispatch(hintsSlice.actions.updateOne({ partId, id, changes: { content } })),
    removeOne: (partId: ID) => (id: HintId) =>
      dispatch(hintsSlice.actions.removeOne({ partId, id })),
  }),
  (stateProps, dispatchProps) => ({
    deerInHeadlightsHint: stateProps.deerInHeadlightsHint,
    cognitiveHints: stateProps.cognitiveHints,
    bottomOutHint: stateProps.bottomOutHint,
    addOne: dispatchProps.addOne(stateProps.partId),
    updateOne: dispatchProps.updateOne(stateProps.partId),
    removeOne: dispatchProps.removeOne(stateProps.partId),
  }),
)(Unconnected);
