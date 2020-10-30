import { React, useState, useEffect, useRef } from 'vendor';
import {EditorState} from 'prosemirror-state'
import {EditorView} from 'prosemirror-view'
import {Schema, DOMParser} from 'prosemirror-model'
import {schema} from 'prosemirror-schema-basic'
import {addListNodes} from 'prosemirror-schema-list'
import {exampleSetup} from 'prosemirror-example-setup';
import {tableEditing, columnResizing, tableNodes, fixTables} from 'prosemirror-tables';
import Wrapper from './wrapper.js';
import 'prosemirror-example-setup/style/style.css';
import './prosemirror.css';
import ImgNodeSpec from './img-node'

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
    })).append(
      [ImgNodeSpec],     
    ),
  marks: schema.spec.marks,
});

class ImageView {
  constructor(node) {
    console.log("NEW IMG")
    // The editor will use this as the node's DOM representation
    this.dom = document.createElement("img")
    this.dom.src = node.attrs.src
    this.dom.addEventListener("click", e => {
      console.log("You clicked me!")
      e.preventDefault()
    })
  }

  stopEvent() { return true }
}

const nodeViews = {
  img: (...args) => new ImageView(...args)
}

const parser = DOMParser.fromSchema(mySchema);

const ProseMirrorEditor = ({ content }) => {
  const [editor, setEditor] = useState();
  const wrapperRef = useRef();
  const contentRef = useRef();
  useEffect(() => {
    if (wrapperRef.current) {
      contentRef.current.innerHTML = content;
      setEditor(
        new EditorView(wrapperRef.current, {
          nodeViews,
          state: EditorState.create({
            doc: parser.parse(contentRef.current),
            plugins: exampleSetup({ schema: mySchema }),
          }),
        })
      );
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

export default ProseMirrorEditor;
