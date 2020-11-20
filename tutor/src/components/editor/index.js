import { React, PropTypes, styled, cn, useState, useMemo } from 'vendor';
import { ArbitraryHtmlAndMath as HTML } from 'shared';
import { Editor, convertFromHTML } from 'perry-white';
import 'perry-white/dist/styles.css';
import { EditorRuntime } from './runtime';

const Editing = ({ className, html, onSave }) => {
  const defaultEditorState = useMemo(() => convertFromHTML(html, null, null), [html]);
  const runtime = useMemo(() => new EditorRuntime({ onSave }), [onSave]);

  return (
    <Editor
      className={className}
      defaultEditorState={defaultEditorState}
      height="100%" width="100%"
      runtime={runtime}
      fitToContent
    />
  );
};
Editing.propTypes = {
  className: PropTypes.string,
  html: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
};

const Wrapper = styled.div({
  margin: '40px',
  height: '500px',
});

const ClickToEdit = ({ className, html: defaultHTML }) => {
  const [isEditing, setEditing] = useState(false);
  const [currentHTML, setHTML] = useState(defaultHTML);
  const onSave = React.useCallback((html) => {
    if (html) {
      setHTML(html);
      setEditing(false);
    }
  }, [setEditing, setHTML]);
  const body = isEditing ?
    <Editing html={currentHTML} onSave={onSave} /> : <HTML html={currentHTML} onClick={() => setEditing(true)}/>;

  return (
    <Wrapper className={cn('editable-html', className, { isEditing })}>
      {body}
    </Wrapper>
  );

};
ClickToEdit.propTypes = {
  className: PropTypes.string,
  html: PropTypes.string.isRequired,
};


export { ClickToEdit };
