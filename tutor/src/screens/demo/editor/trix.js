import { React, useState, useEffect, useRef } from 'vendor';
import Wrapper from './wrapper.js'

import 'trix/dist/trix.css';
import Trix from 'trix/dist/trix.js';


const TrixEditor = ({ content }) => {
  const [editor, setEditor] = useState();
  const wrapperRef = useRef();
  const contentRef = useRef();
  useEffect(() => {
    console.log(content, contentRef.current)
  }, []);

  return (
    <Wrapper>
      <input id="x" value={content} name="content" type="hidden" />
      <trix-editor input="x" ref={contentRef} />
    </Wrapper>
  );

};

export default TrixEditor;
