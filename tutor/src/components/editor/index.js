import { React, PropTypes, useState, useMemo } from 'vendor';
import { ArbitraryHtmlAndMath as HTML } from 'shared';
import { Editor, convertFromHTML } from 'perry-white'
import 'perry-white/dist/styles.css'
import { EditorRuntime } from './runtime'

const Editing = ({ html, onSave }) => {
  const defaultEditorState = useMemo(() => convertFromHTML(html, null, null), [html]);
  const runtime = useMemo(() => new EditorRuntime({ onSave }), [onSave])

  return (
    <Editor
      defaultEditorState={defaultEditorState}
      height="100%" width="100%"
      runtime={runtime}
      fitToContent
    />
  );
};
Editing.propTypes = {
  html: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
}

const ClickToEdit = ({ html: defaultHTML }) => {
  const [isEditing, setEditing] = useState(false)
  const [currentHTML, setHTML] = useState(defaultHTML)
  const onSave = React.useCallback((html) => {
    if (html) {
      setHTML(html)
      setEditing(false)
    }
  }, [setEditing, setHTML])
  const body = isEditing ?
    <Editing html={currentHTML} onSave={onSave} /> : <HTML html={currentHTML} onClick={() => setEditing(true)}/>;

  return (
    <div style={{ margin: '100px', height: '500px' }}>
      {body}
    </div>
  )

}
ClickToEdit.propTypes = {
  html: PropTypes.string.isRequired,
}


export { ClickToEdit }
