import React from 'react';
import { RichText } from 'components/activities/types';
import { Editor } from 'components/editing/editor/Editor';
import { getToolbarForResourceType } from 'components/editing/toolbars/insertion/items';
import { ErrorBoundary } from 'components/common/ErrorBoundary';
import { classNames } from 'utils/classNames';
import { useActivityContext } from 'components/activities/check_all_that_apply/CheckAllThatApplyAuthoring';

type RichTextEditorProps = {
  text: RichText;
  onEdit: (text: RichText) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
};
export const RichTextEditor = ({
  className,
  text,
  onEdit,
  placeholder,
  style,
}: React.PropsWithChildren<RichTextEditorProps>) => {
  const { editMode, projectSlug } = useActivityContext();

  return (
    <div className={classNames(['rich-text-editor', className])}>
      <ErrorBoundary>
        <Editor
          commandContext={{ projectSlug }}
          editMode={editMode}
          value={text.model}
          onEdit={(model, selection) => onEdit({ model, selection })}
          selection={text.selection}
          toolbarItems={getToolbarForResourceType(1)}
          placeholder={placeholder}
          style={style}
        />
      </ErrorBoundary>
    </div>
  );
};
