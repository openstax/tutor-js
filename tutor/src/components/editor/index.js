import { React, PropTypes, styled, cn, useState, useMemo, useEffect } from 'vendor';
import { ArbitraryHtmlAndMath as HTML } from 'shared';
import { Editor, convertFromHTML } from 'perry-white';
import 'perry-white/dist/styles.css';
import { EditorRuntime } from './runtime';

const Editing = ({ className, html, onImageUpload, onSave, ...props }) => {
  const defaultEditorState = useMemo(() => convertFromHTML(html, null, null), [html]);
  const runtime = useMemo(() => new EditorRuntime({ onSave, onImageUpload }), [onSave, onImageUpload]);

  return (
    <Editor
      className={className}
      defaultEditorState={defaultEditorState}
      runtime={runtime}
      autoFocus
      {...props}
    />
  );
};
Editing.propTypes = {
  className: PropTypes.string,
  html: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
  onImageUpload: PropTypes.func.isRequired,
};

const Wrapper = styled.div({
  margin: '40px',
  minHeight: '300px',
  display: 'flex',
  '.openstax-has-html': {
    flex: 1,
  },
});

export const EditableHTML = ({
  className,
  html: defaultHTML = '',
  placeholder,
  onImageUpload,
  onChange,
}) => {
  const [isEditing, setEditing] = useState(false);
  const [currentHTML, setHTML] = useState(defaultHTML);
  const onSave = React.useCallback((html) => {
    if (html) {
      setHTML(html);
      setEditing(false);
      if (onChange) {
        onChange(html);
      }
    }
  }, [setEditing, setHTML]);

  // listen if the html prop is changed outside of the editor
  useEffect(() => {
    setHTML(defaultHTML);
  }, [defaultHTML]);

  let body;
  if (isEditing) {
    body = <Editing html={currentHTML} onImageUpload={onImageUpload} onSave={onSave} />;
  } else {
    body = <HTML autoFocus html={currentHTML || placeholder} onClick={() => setEditing(true)}/>;
  }


  return (
    <Wrapper className={cn('editable-html', className, { isEditing })}>
      {body}
    </Wrapper>
  );

};
EditableHTML.propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.node,
  onChange: PropTypes.func,
  onImageUpload: PropTypes.func.isRequired,
  html: PropTypes.string.isRequired,
};
