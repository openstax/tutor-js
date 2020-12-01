import { React, PropTypes, Theme, styled, cn, useState, useMemo, useEffect } from 'vendor';
import { ArbitraryHtmlAndMath as HTML } from 'shared';
import { Editor, convertFromHTML } from 'perry-white';
import 'perry-white/dist/styles.css';
import { FullFeaturedEditorRuntime, LimitedEditorRuntime } from './runtime';

const Editing = ({ className, html, runtime, ...props }) => {
  const defaultEditorState = useMemo(() => convertFromHTML(html, null, null), [html]);

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
  runtime: PropTypes.object.isRequired,
  html: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
  onImageUpload: PropTypes.func.isRequired,
};

const Wrapper = styled.div({
  margin: '40px',
  minHeight: '150px',
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
  limitedEditing,
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
  const runtimes = useMemo(() => ({
    full: new FullFeaturedEditorRuntime({ onSave, onImageUpload }),
    limited: new LimitedEditorRuntime({ onSave, onImageUpload }),
  }), [onSave, onImageUpload]);
  useEffect(() => {
    document.body.style.setProperty('--keyboard-zindex', Theme.zIndex.modal + 1);
  },[]);
  let body;
  if (isEditing) {
    body = <Editing html={currentHTML} runtime={limitedEditing ? runtimes.limited : runtimes.full} />;
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
  limitedEditing: PropTypes.bool.isRequired,
  onImageUpload: PropTypes.func.isRequired,
  html: PropTypes.string.isRequired,
};
