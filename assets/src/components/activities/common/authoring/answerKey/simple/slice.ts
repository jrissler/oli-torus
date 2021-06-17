import { createAction } from '@reduxjs/toolkit';
import { ChoiceId } from 'components/activities/types';
import { TargetedResponseMapping } from '../../responseChoices/responseChoicesSlice';

// export const toggleAnswerChoice = createAction<{
//   id: ChoiceId;
//   responseMapping: TargetedResponseMapping;
// }>('answerKey/toggleAnswerChoice');