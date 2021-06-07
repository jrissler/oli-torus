import React from 'react';
import { RichTextEditor } from 'components/content/RichTextEditor';
import { HasStem, RichText, Stem as StemType } from '../../types';
import { HtmlContentModelRenderer } from 'data/content/writers/renderer';
import { WriterContext } from 'data/content/writers/context';
import { connect } from 'react-redux';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { makeStem } from '../authoring/utils';

export const selectStem = (state: HasStem) => state.stem;
const initialState: StemType = makeStem('');
export const stemSlice = createSlice({
  name: 'stem',
  initialState,
  reducers: {
    set(state, action: PayloadAction<RichText>) {
      state.content = action.payload;
    },
  },
});

interface AuthoringProps {
  stem: StemType;
  onStemChange: (text: RichText) => void;
}

export const Authoring: React.FC<AuthoringProps> = ({ stem, onStemChange }) => {
  return (
    <div className="mb-2 flex-grow-1">
      <RichTextEditor
        style={{ padding: '16px', fontSize: '18px' }}
        text={stem.content}
        onEdit={onStemChange}
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
  Authoring: {
    Unconnected: Authoring,
    Connected: connect(
      (state: HasStem) => ({ stem: state.stem }),
      (dispatch) => ({
        onStemChange: (text: RichText) => dispatch(stemSlice.actions.set(text)),
      }),
    )(Authoring),
  },
  Delivery,
};
