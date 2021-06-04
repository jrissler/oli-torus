import React from 'react';
import { RichTextEditor } from 'components/content/RichTextEditor';
import { HasStem, RichText, Stem as StemType } from '../../types';
import { HtmlContentModelRenderer } from 'data/content/writers/renderer';
import { WriterContext } from 'data/content/writers/context';
import produce, { Draft } from 'immer';
import { useDispatch, useSelector } from 'react-redux';

import { makeStem } from '../authoring/utils';
import { useActivityContext } from 'components/activities/check_all_that_apply/CheckAllThatApplyAuthoring';
import { stemSlice } from './redux';

// const toggleReducer = (state: HasStem, action:) => {
//   switch (action.type)
// }
// export function useStem({ reducer = stemSlice.reducer } = {}) {
//   const {
//     model: { stem },
//     // dispatch,
//   } = useActivityContext<HasStem>();
//   const [state, dispatch] = React.useReducer(reducer, stem);

//   const setStem = (content: RichText) =>
//     produce((draft: Draft<HasStem>) => {
//       draft.stem.content = content;
//     });

//   return { stem, setStem, dispatch };
// }

interface AuthoringProps {
  onStemChange?: (text: RichText) => void;
}

export const Authoring = ({ onStemChange }: AuthoringProps) => {
  // const { stem, setStem, dispatch } = useStem();
  // const stem = useSelector((state: HasStem) => console.log('state', state) || state.stem);
  // console.log('state', stem);
  // const dispatch = useDispatch();
  const { dispatch, model } = useActivityContext<HasStem>();
  const stem = model.stem;

  return (
    <div className="mb-2 flex-grow-1">
      <RichTextEditor
        style={{ padding: '16px', fontSize: '18px' }}
        text={stem.content}
        // onEdit={(text) => (onStemChange ? onStemChange(text) : dispatch(setStem(text)))}
        onEdit={(text) => (onStemChange ? onStemChange(text) : stemSlice.actions.set(text))}
        // onEdit={(text) => dispatch(stemSlice.actions.set(text))}
        placeholder="Question"
      />
    </div>
  );
};

interface DeliveryProps {
  stem: StemType;
  context: WriterContext;
}

export const Delivery = ({ stem, context }: DeliveryProps) => {
  return <HtmlContentModelRenderer text={stem.content} context={context} />;
};

export const Stem = {
  Authoring,
  Delivery,
};
