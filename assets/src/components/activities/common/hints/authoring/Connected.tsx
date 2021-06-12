import { HintId, RichText } from 'components/activities/types';
import { connect } from 'react-redux';
import { Unconnected } from 'components/activities/common/hints/authoring/Unconnected';
import { hintsSlice } from './slice';
import { HasParts } from '../../authoring/parts/types';
import { makeHint } from '../types';

// CATA activities only have one part, so it is hardcoded here
export const Connected = connect(
  (state: HasParts) => {
    const hints = state.authoring.parts[0].hints;
    return {
      deerInHeadlightsHint: hints[0],
      cognitiveHints: hints.slice(1, hints.length - 1),
      bottomOutHint: hints[hints.length - 1],
    };
  },
  (dispatch) => ({
    addOne: () => dispatch(hintsSlice.actions.addOne({ partId: '1', hint: makeHint('') })),
    updateOne: (id: HintId, content: RichText) =>
      dispatch(hintsSlice.actions.updateOne({ partId: '1', id, changes: { content } })),
    removeOne: (id: HintId) => dispatch(hintsSlice.actions.removeOne({ partId: '1', id })),
  }),
)(Unconnected);
