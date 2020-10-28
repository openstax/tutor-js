import { React, PropTypes, styled, observer, observable, action } from 'vendor';
import Quill from 'quill';
import ImageResize from 'quill-image-resize-alt-module';

import { ImageUploader } from './editor/image-uploader';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ArbitraryHtmlAndMath, Icon } from 'shared';

Quill.register({
  'modules/imageResize': ImageResize,
}, true);

const EditorWrapper = styled.div`
  width: 800px;
  background-color: white;
  margin: 20px auto;
  min-height: 300px;
  display: flex;

.quill {
    display: flex;
    flex: 1;
    flex-direction: column;

}

.ql-container {
  height: 100%;
  /* added these styles */
  flex: 1;
  display: flex;
  flex-direction: column;
}

.ql-editor {
  height: 100%;
  /* added these styles */
  flex: 1;
  overflow-y: auto;
  width: 100%;
}

`;


@observer
class Editor extends React.Component {

  static propTypes = {
    className: PropTypes.string,
    defaultValue: PropTypes.string,
  }

  imageUploaderRef = null
  quillRef = null

  get modules() {
    const editor = this;
    return {
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike', 'formula'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
          [ 'link', 'video', 'image'],
        ],
        handlers: {
          image() {
            const { controls } = this;
            const imgControl = controls.find(c => c[0] == 'image');
            editor.imageUploaderRef.toggle(imgControl[1]);
          },
        },
      },
      imageResize: {
        parchment: Quill.import('parchment'),
      },
    };
  }

  getQuill = () => {
    return this.quillRef.editor;
  }
  
  render() {
    const { defaultValue, className = '' } = this.props;

    return (
      <EditorWrapper>
        <ReactQuill
          defaultValue={defaultValue}
          ref={(r) => this.quillRef = r}
          placeholder="write here…"
          modules={this.modules}
          className={className}
        />
        <ImageUploader ref={r => this.imageUploaderRef = r} getQuill={this.getQuill} />
      </EditorWrapper>
    );
  }
}

const Display = ({ content }) => (
  <EditorWrapper><ArbitraryHtmlAndMath html={content} /></EditorWrapper>
);
Display.propTypes = {
  content: PropTypes.string.isRequired,
};

@observer
class InlineEditor extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    content: PropTypes.string.isRequired,
  }

  @observable isEditing = false

  @action.bound setEditing() {
    this.isEditing = !this.isEditing;
  }
  
  render() {
    const { content } = this.props;

    return (
      <div className="d-flex">
        <Icon type="edit" onClick={this.setEditing} />
        {this.isEditing ? <Editor defaultValue={content} /> : <Display content={content} />}
      </div>
    );
  }
  
}

export { Editor, InlineEditor };
