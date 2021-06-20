import React from 'react';
import ReactDOM from 'react-dom';
import { AuthoringElement, AuthoringElementProps } from '../AuthoringElement';
import { ShortAnswerModelSchema, InputType } from './schema';
import { Feedback } from './sections/Feedback';
import { ShortAnswerActions } from './actions';
import { ModalDisplay } from 'components/modal/ModalDisplay';
import { Provider } from 'react-redux';
import { configureStore } from 'state/store';
import produce from 'immer';
import { Manifest } from 'data/content/activities/activity';

const store = configureStore();

const inputs: { value: string; displayValue: string }[] = [
  { value: 'numeric', displayValue: 'Numeric' },
  { value: 'text', displayValue: 'Short Text' },
  { value: 'textarea', displayValue: 'Long Text' },
];

type InputTypeDropdownProps = {
  editMode: boolean;
  onChange: (inputType: InputType) => void;
  inputType: InputType;
};
export const InputTypeDropdown = ({ onChange, editMode, inputType }: InputTypeDropdownProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as InputType);
  };

  return (
    <div className="mb-3">
      <label htmlFor="question-type">Input Type</label>
      <select
        style={{ width: '200px' }}
        disabled={!editMode}
        className="form-control"
        value={inputType}
        onChange={handleChange}
        name="question-type"
        id="question-type"
      >
        {inputs.map((option) => (
          <option key={option.value} value={option.value}>
            {option.displayValue}
          </option>
        ))}
      </select>
    </div>
  );
};

const ShortAnswer = (props: AuthoringElementProps<ShortAnswerModelSchema>) => {
  const dispatch = (action: (model: ShortAnswerModelSchema) => void) =>
    props.onEdit(produce(props.model, action));

  const sharedProps = {
    model: props.model,
    editMode: props.editMode,
  };

  return (
    <div>
      <InputTypeDropdown
        editMode={props.editMode}
        inputType={props.model.inputType}
        onChange={(inputType) => dispatch(ShortAnswerActions.setInputType(inputType))}
      />
      {/* <Stem
        projectSlug={props.projectSlug}
        editMode={props.editMode}
        stem={props.model.stem}
        onEditStem={(content) => dispatch(ShortAnswerActions.editStem(content))}
      /> */}
      <Feedback
        {...sharedProps}
        onAddResponse={() => dispatch(ShortAnswerActions.addResponse())}
        onRemoveResponse={(id) => dispatch(ShortAnswerActions.removeReponse(id))}
        onEditResponseRule={(id, rule) => dispatch(ShortAnswerActions.editRule(id, rule))}
        onEditResponse={(id, content) => dispatch(ShortAnswerActions.editFeedback(id, content))}
      />
      {/* <Hints
        projectSlug={props.projectSlug}
        hints={props.model.authoring.parts[0].hints}
        editMode={props.editMode}
        onAddHint={() => dispatch(ShortAnswerActions.addHint())}
        onEditHint={(id, content) => dispatch(ShortAnswerActions.editHint(id, content))}
        onRemoveHint={(id) => dispatch(ShortAnswerActions.removeHint(id))}
      /> */}
    </div>
  );
};

export class ShortAnswerAuthoring extends AuthoringElement<ShortAnswerModelSchema> {
  render(mountPoint: HTMLDivElement, props: AuthoringElementProps<ShortAnswerModelSchema>) {
    ReactDOM.render(
      <Provider store={store}>
        <ShortAnswer {...props} />
        <ModalDisplay />
      </Provider>,
      mountPoint,
    );
  }
}
// eslint-disable-next-line
const manifest = require('./manifest.json') as Manifest;
window.customElements.define(manifest.authoring.element, ShortAnswerAuthoring);
