import React from 'react';
import ReactDOM from 'react-dom';
import { AuthoringElement, AuthoringElementProps } from '../AuthoringElement';
import { MultipleChoiceModelSchema } from './schema';
import { ModalDisplay } from 'components/modal/ModalDisplay';
import { Provider } from 'react-redux';
import { configureStore } from 'state/store';
import produce from 'immer';
import { Stem } from '../common/stem';
import { MCActions } from './actions';
import { Manifest } from 'data/content/activities/activities';
import { Choices } from '../common/choices';

const store = configureStore();

const MultipleChoice = (props: AuthoringElementProps<MultipleChoiceModelSchema>) => {
  const dispatch = (action: (state: MultipleChoiceModelSchema) => void) =>
    props.onEdit(produce(props.model, action));

  const { projectSlug } = props;

  const sharedProps = {
    model: props.model,
    editMode: props.editMode,
    projectSlug,
  };

  return (
    <React.Fragment>
      <Stem.Authoring.Unconnected
        stem={props.model.stem}
        update={(content) => dispatch(MCActions.editStem(content))}
      />

      {/* <Choices.Authoring.Unconnected
        addOne={() => dispatch(MCActions.addChoice())}
        setAll={(id, content) => dispatch(MCActions.editChoice(id, content))}
        onRemoveOne={(id) => dispatch(MCActions.removeChoice(id))}
        onToggleAnswerChoiceShuffling={() => dispatch(MCActions.toggleAnswerChoiceShuffling())}
        isShuffled={areAnswerChoicesShuffled(props.model)}
      /> */}
      {/*}
      <TargetedFeedback>
        <Feedback
          {...sharedProps}
          onEditResponse={(id, content) => dispatch(MCActions.editFeedback(id, content))}
        />
      </TargetedFeedback>
      <Hints
        projectSlug={props.projectSlug}
        hints={props.model.authoring.parts[0].hints}
        editMode={props.editMode}
        onAddHint={() => dispatch(MCActions.addHint())}
        onEditHint={(id, content) => dispatch(MCActions.editHint(id, content))}
        onRemoveHint={(id) => dispatch(MCActions.removeHint(id))}
      /> */}
    </React.Fragment>
  );
};

export class MultipleChoiceAuthoring extends AuthoringElement<MultipleChoiceModelSchema> {
  render(mountPoint: HTMLDivElement, props: AuthoringElementProps<MultipleChoiceModelSchema>) {
    ReactDOM.render(
      <Provider store={store}>
        <MultipleChoice {...props} />
        <ModalDisplay />
      </Provider>,
      mountPoint,
    );
  }
}
// eslint-disable-next-line
const manifest = require('./manifest.json') as Manifest;
window.customElements.define(manifest.authoring.element, MultipleChoiceAuthoring);
