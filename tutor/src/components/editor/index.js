import { React, useState, useEffect, useRef } from 'vendor';
import {EditorState} from 'prosemirror-state'
import {EditorView} from 'prosemirror-view'
import {Schema, DOMParser} from 'prosemirror-model'
import {schema} from 'prosemirror-schema-basic'
import {addListNodes} from 'prosemirror-schema-list'
import {exampleSetup} from 'prosemirror-example-setup';
import {tableEditing, columnResizing, tableNodes, fixTables} from 'prosemirror-tables';
import Wrapper from './wrapper.js';
import ImgNodeSpec from './img-node-spec'
import ImgNodeView from './image-node-view'

function bindNodeView(NodeView) {
  return (node, view, getPos, decorations) => {
    return new NodeView(node, view, getPos, decorations);
  };
}

const mySchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block')
    .append(tableNodes({
      tableGroup: 'block',
      cellContent: 'block+',
      cellAttributes: {
        background: {
          default: null,
          getFromDOM(dom) { return dom.style.backgroundColor || null },
          setDOMAttr(value, attrs) { if (value) attrs.style = (attrs.style || '') + `background-color: ${value};` }
        },
      },
    })).append({
      image: ImgNodeSpec,
    }),
  marks: schema.spec.marks,
});


const nodeViews = {
  'image': (...args) => new ImgNodeView(...args),
}


const parser = DOMParser.fromSchema(mySchema);


export const Editor = ({ content }) => {
  const [editor, setEditor] = useState();
  const wrapperRef = useRef();
  const contentRef = useRef();
  useEffect(() => {
    if (wrapperRef.current) {
      contentRef.current.innerHTML = content;

      const ed = new EditorView(wrapperRef.current, {
        nodeViews: nodeViews,
        state: EditorState.create({
          doc: parser.parse(contentRef.current),
          plugins: exampleSetup({ schema: mySchema }),
        }),
      })
      setEditor(ed)
    }
  }, []);

  return (
    <div>
      <h1>ProseMirror</h1>
      <div style={{ display: 'none' }} ref={contentRef} />
      <Wrapper ref={wrapperRef} />
    </div>
  );

};

