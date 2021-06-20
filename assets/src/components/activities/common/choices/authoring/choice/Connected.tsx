import { ChoiceId, RichText } from 'data/content/activities/activity';
import { connect } from 'react-redux';
import { choicesSlice } from '../slice';
import { Unconnected } from './Unconnected';

export const Connected = connect(null, (dispatch) => ({
  onEdit: (id: ChoiceId, content: RichText) =>
    dispatch(choicesSlice.actions.updateOne({ id, changes: { content } })),
  onRemove: (id: ChoiceId) => dispatch(choicesSlice.actions.removeOne(id)),
}))(Unconnected);
