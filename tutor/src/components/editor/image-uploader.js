import { React, PropTypes, observable, action, useState, useCallback, observer, styled } from 'vendor';
import { Alert } from 'react-bootstrap';
import { Popover, Overlay } from 'react-bootstrap';
import Quill from 'quill';
import { useDropzone } from 'react-dropzone';
import { DirectUpload } from '@rails/activestorage';

const STORAGE_PATH = '/rails/active_storage';

const DropzoneWrapper = styled.div`
    border: 2px dashed ${({ theme }) => theme.colors.line};
    border-radius: 5px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin: 0 0 1rem 0;
`;

const Dropzone = ({ onAdd }) => {
  const [errors, setErrors] = useState([]);
  
  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.forEach(file => {
      const upload = new DirectUpload(file, `${STORAGE_PATH}/direct_uploads`);
      upload.create((error, blob) => {
        if (error) {
          setErrors(errors.concat(error));
        } else {
          onAdd(blob);
        }
      });
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    acceptedFiles: 'image/jpeg,image/png,image/gif',
    autoProcessQueue: true,
    uploadMultiple: true,
  });

  return (
    <DropzoneWrapper {...getRootProps()} >
      {errors.map((err,i) => <Alert key={i} variant="danger">{String(err)}</Alert>)}
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </DropzoneWrapper>
  );
};
Dropzone.propTypes = {
  onAdd: PropTypes.func.isRequired,
};

const Image = ({ blob, onClick }) => {
  return (
    <img src={`${STORAGE_PATH}/blobs/${blob.signed_id}/${blob.filename}`} onClick={onClick} />
  );
};
Image.propTypes = {
  blob: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};
const ImagesList = styled.div`
    overflow-y: scroll;
    position: relative;
    height: 300px;
    img {
      width: 100%;
      cursor: pointer;
      &:not(:last-child) {
        border-bottom: 1px solid ${({ theme }) => theme.colors.line};
        padding-bottom: 1rem;
        margin-bottom: 1rem;
      }
   }
`;

@observer
class ImageUploader extends React.Component {

  static propTypes = {
    getQuill: PropTypes.func.isRequired,
  }
  state = {}
  @observable isShowing = false;
  @observable target;
  @observable blobs = []
  
  wrapperRef = React.createRef()

  @action.bound toggle(btn) {
    this.target = btn;
    this.isShowing = !this.isShowing;
  }

  @action.bound insertImg({ target: img }) {
    const quill = this.props.getQuill();
    const index = (quill.getSelection() || {}).index || quill.getLength();
    const url = img.getAttribute('src');
    if (index) {
      quill.insertEmbed(index, 'image', url, Quill.sources.USER);
    }
    this.onHide();
  }

  @action.bound addImage(blob) {
    this.blobs.push(blob);
  }

  @action.bound onHide(ev = {}) {
    if (ev.defaultPrevented !== true) {
      this.isShowing = false;
    }
  }

  render() {
    
    return (
      <div ref={this.wrapperRef}>
        <Overlay
          rootClose
          show={this.isShowing}
          target={this.target}
          placement="bottom"
          onHide={this.onHide}
          container={this.wrapperRef.current}
          containerPadding={20}
        >
          <Popover id="popover-contained">
            <Popover.Title as="h3">Images</Popover.Title>
            <Popover.Content>
              <Dropzone onAdd={this.addImage} />
              <ImagesList>
                {this.blobs.map(blob => <Image key={blob.id} blob={blob} onClick={this.insertImg} />)}
                <img src="http://placekitten.com/g/300/100" onClick={this.insertImg} />
                <img src="http://placekitten.com/g/250/100" onClick={this.insertImg} />
              </ImagesList>
            </Popover.Content>
          </Popover>
        </Overlay>
      </div>
    );
  }
}

export { ImageUploader };
