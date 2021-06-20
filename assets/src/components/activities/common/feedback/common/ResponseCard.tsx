import { Card } from 'components/common/Card';
import { ID } from 'data/content/model';
import React, { useMemo } from 'react';
import { RichTextEditor } from 'components/content/RichTextEditor';
import { Choices } from '../../choices';
import { defaultWriterContext } from 'data/content/writers/context';
import { Checkbox } from '../../authoring/icons/checkbox/Checkbox';
import { Tooltip } from '../../authoring/Tooltip';
import { ChoiceId, RichText } from 'data/content/activities/activity';
import { IFeedback } from 'data/content/activities/feedback';
import { IChoice } from 'data/content/activities/choice';

export const ResponseFeedbackCard: React.FC<{
  title: React.ReactNode;
  feedback: IFeedback;
  choices: IChoice[];
  correctChoiceIds: ChoiceId[];
  toggleChoice: (id: ChoiceId) => void;
  updateFeedback: (id: ID, content: RichText) => void;
}> = ({ title, feedback, choices, toggleChoice, updateFeedback, correctChoiceIds }) => {
  const context = useMemo(defaultWriterContext, []);
  return (
    <Card.Card>
      <Card.Title>
        <>
          {title}
          <Tooltip
            title={'Shown only when a student response matches this answer choice combination'}
          />
        </>
      </Card.Title>
      <Card.Content>
        <Choices.Delivery
          unselectedIcon={<Checkbox.Unchecked />}
          selectedIcon={<Checkbox.Checked />}
          choices={choices}
          selected={correctChoiceIds}
          onSelect={toggleChoice}
          isEvaluated={false}
          context={context}
        />
        <RichTextEditor
          style={{ backgroundColor: 'white' }}
          placeholder="Enter feedback"
          text={feedback.content}
          onEdit={(content) => updateFeedback(feedback.id, content)}
        />
      </Card.Content>
    </Card.Card>
  );
};
