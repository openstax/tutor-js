import { React } from 'vendor';
import { asyncComponent } from '../../helpers/async-component';
// import { Editor } from '../../components/editor';
//import { Editor, COMMAND_GROUPS, TABLE_COMMANDS_GROUP } from 'pmrosemirror-plus'

import * as Editor from 'perry-white'
//import 'perry-white/dist/styles.css'
// import convertFromHTML from 'prosemirror-plus/dist/convertFromHTML'

console.log(Editor)


// import {COMMAND_GROUPS} from 'prosemirror-plus/dist/ui/EditorToolbarConfig';

const docJSON = { 'type': 'doc', 'attrs': { 'layout': null, 'padding': null, 'width': null }, 'content': [{ 'type': 'paragraph', 'attrs': { 'align': null, 'color': null, 'id': null, 'indent': null, 'lineSpacing': null, 'paddingBottom': null, 'paddingTop': null }, 'content': [{ 'type': 'text', 'marks': [{ 'type': 'mark-font-type', 'attrs': { 'name': 'Arial Black' } }], 'text': 'First line Arial black' }] }, { 'type': 'ordered_list', 'attrs': { 'id': null, 'counterReset': null, 'indent': 0, 'following': null, 'listStyleType': null, 'name': null, 'start': 1 }, 'content': [{ 'type': 'list_item', 'attrs': { 'align': null }, 'content': [{ 'type': 'paragraph', 'attrs': { 'align': null, 'color': null, 'id': null, 'indent': null, 'lineSpacing': null, 'paddingBottom': null, 'paddingTop': null }, 'content': [{ 'type': 'text', 'text': 'List 1' }] }] }] }, { 'type': 'ordered_list', 'attrs': { 'id': null, 'counterReset': null, 'indent': 1, 'following': null, 'listStyleType': null, 'name': null, 'start': 1 }, 'content': [{ 'type': 'list_item', 'attrs': { 'align': null }, 'content': [{ 'type': 'paragraph', 'attrs': { 'align': null, 'color': null, 'id': null, 'indent': null, 'lineSpacing': null, 'paddingBottom': null, 'paddingTop': null }, 'content': [{ 'type': 'text', 'text': 'Child' }] }] }] }, { 'type': 'ordered_list', 'attrs': { 'id': null, 'counterReset': 'none', 'indent': 0, 'following': null, 'listStyleType': null, 'name': null, 'start': 1 }, 'content': [{ 'type': 'list_item', 'attrs': { 'align': null }, 'content': [{ 'type': 'paragraph', 'attrs': { 'align': null, 'color': null, 'id': null, 'indent': null, 'lineSpacing': null, 'paddingBottom': null, 'paddingTop': null }, 'content': [{ 'type': 'text', 'text': 'List 2' }] }] }] }, { 'type': 'paragraph', 'attrs': { 'align': 'center', 'color': null, 'id': null, 'indent': null, 'lineSpacing': null, 'paddingBottom': null, 'paddingTop': null }, 'content': [{ 'type': 'text', 'text': 'Align' }] }, { 'type': 'paragraph', 'attrs': { 'align': null, 'color': null, 'id': null, 'indent': null, 'lineSpacing': null, 'paddingBottom': null, 'paddingTop': null }, 'content': [{ 'type': 'text', 'marks': [{ 'type': 'mark-text-color', 'attrs': { 'color': '#f20d96' } }], 'text': 'Font' }, { 'type': 'text', 'text': ' ' }, { 'type': 'text', 'marks': [{ 'type': 'mark-text-highlight', 'attrs': { 'highlightColor': '#e5e5e5' } }], 'text': 'Color ' }, { 'type': 'text', 'marks': [{ 'type': 'strong' }], 'text': 'align ' }, { 'type': 'text', 'marks': [{ 'type': 'link', 'attrs': { 'href': 'http://www.google.com', 'rel': 'noopener noreferrer nofollow', 'target': 'blank', 'title': null } }, { 'type': 'em' }], 'text': 'Link to google' }, { 'type': 'text', 'marks': [{ 'type': 'em' }], 'text': ' ' }, { 'type': 'text', 'marks': [{ 'type': 'underline' }], 'text': 'underline ' }, { 'type': 'text', 'marks': [{ 'type': 'em' }, { 'type': 'strong' }, { 'type': 'mark-text-color', 'attrs': { 'color': '#e5e5e5' } }, { 'type': 'mark-text-highlight', 'attrs': { 'highlightColor': '#979797' } }, { 'type': 'underline' }], 'text': 'combined' }] }, { 'type': 'heading', 'attrs': { 'align': null, 'color': null, 'id': null, 'indent': null, 'lineSpacing': null, 'paddingBottom': null, 'paddingTop': null, 'level': 1 }, 'content': [{ 'type': 'text', 'text': 'Header 1' }] }, { 'type': 'paragraph', 'attrs': { 'align': null, 'color': null, 'id': null, 'indent': null, 'lineSpacing': null, 'paddingBottom': null, 'paddingTop': null } }, { 'type': 'table', 'attrs': { 'marginLeft': null }, 'content': [{ 'type': 'table_row', 'content': [{ 'type': 'table_cell', 'attrs': { 'colspan': 1, 'rowspan': 1, 'colwidth': null, 'borderColor': null, 'background': null }, 'content': [{ 'type': 'paragraph', 'attrs': { 'align': null, 'color': null, 'id': null, 'indent': null, 'lineSpacing': null, 'paddingBottom': null, 'paddingTop': null }, 'content': [{ 'type': 'text', 'marks': [{ 'type': 'strong' }], 'text': 'Cell 1' }] }] }, { 'type': 'table_cell', 'attrs': { 'colspan': 1, 'rowspan': 1, 'colwidth': null, 'borderColor': null, 'background': null }, 'content': [{ 'type': 'paragraph', 'attrs': { 'align': null, 'color': null, 'id': null, 'indent': null, 'lineSpacing': null, 'paddingBottom': null, 'paddingTop': null }, 'content': [{ 'type': 'text', 'text': 'Cell 2' }] }] }] }] }, { 'type': 'paragraph', 'attrs': { 'align': null, 'color': null, 'id': null, 'indent': null, 'lineSpacing': null, 'paddingBottom': null, 'paddingTop': null } }, { 'type': 'paragraph', 'attrs': { 'align': null, 'color': null, 'id': null, 'indent': null, 'lineSpacing': null, 'paddingBottom': null, 'paddingTop': null }, 'content': [{ 'type': 'text', 'text': 'Subscript ' }, { 'type': 'text', 'marks': [{ 'type': 'super' }], 'text': '2 ' }] }] };

// const AtlaskitEditor = asyncComponent(() => import(/* webpackChunkName: 'atlaskit' */ './atlaskit'));
// import AtlaskitEditor from './atlaskit';
//const TrixEditor = asyncComponent(() => import(/* webpackChunkName: 'trix' */ './editor/trix'));
//const ProseMirrorEditor = asyncComponent(() => import(/* webpackChunkName: 'prosemirror' */ './editor/prosemirror'));
// import ProseMirrorEditor from './prosemirror';


const fakeExercise = `
<div>
          The graph shows what effect temperature has on the functioning of enzymes.
          What conclusion can be drawn from these data?
          <img src="https://s3-us-west-2.amazonaws.com/openstax-assets/Ss2Xg59OLfjbgarp-prodtutor/exercises/attachments/large_aeb10979cb1265ae1f928677f271c8e4f0f6154a26723b80e40ca3db913579d3.png" alt="The x-axis is temperature in Celsius degrees, ranging from 0 to 70 degrees in increments of 10 degrees.  The y-axis is rate of reaction and is not numbered.  The curve begins at 0 degrees, where the rate of the reaction is close to zero.  The curve proceeds upwards with a sharp slope until peaking at about 38 degrees, where an indicator line is labeled “optimal temperature.”  The curve is relatively flat for another ten degrees and then drops precipitously  from 50 to 60 degrees, hitting zero again at about 61 degrees." />

          <p>
            An experiment investigating the effects of water and fertilizer on plant growth was conducted. Each plant was given the same amount of light per day and was kept at the same temperature. The results are listed in the table.
          </p>
          <table>
            <tbody>
              <tr>
                <th>Day</th>
                <th class="center">Water Only (cm)</th>
                <th class="center">Water and Fertilizer (cm)</th>
              </tr>
              <tr>
                <th>1</th>
                <td>2.0</td>
                <td>2.0</td>
              </tr>
              <tr>
                <th>2</th>
                <td>2.2</td>
                <td>2.3</td>
              </tr>
              <tr>
                <th>3</th>
                <td>2.3</td>
                <td>2.8</td>
              </tr>
              <tr>
                <th>4</th>
                <td>2.5</td>
                <td>3.2</td>
              </tr>
              <tr>
                <th>5</th>
                <td>2.6</td>
                <td>3.8</td>
              </tr>
            </tbody>
          </table>
</div>
`;

      // <h1>Trix</h1>
      // <TrixEditor content={fakeExercise} />
      // <h1>Quill</h1>
      // <InlineEditor content={fakeExercise} />

const EditorDemo = () => {
  const [editorView, setEditorView] = React.useState()
  const [editorState, setEditorState] = React.useState(

  )
  const onReady = React.useCallback((ev) => {
    setEditorView(ev)
  })
  const onChange = React.useCallback(({ state, transaction }) => {

    // const { data: { state, transaction }
    //if (transaction.docChanged) {
    setEditorState(state.apply(transaction))
    //}
  })

  return (
    <div style={{ margin: '100px auto', maxWidth: '1100px', height: '500px' }}>

      <Editor
        onReady={onReady}
        editorState={editorState}
        onChange={onChange}
        height="100%" width="100%"
        readOnly={false} disabled={false}
        data={docJSON} embedded={false}
        fitToContent
        defaultHTML={fakeExercise}
      />

    </div>
  );
};

export default EditorDemo;
