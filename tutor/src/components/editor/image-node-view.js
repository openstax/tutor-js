import { React, PropTypes, styled, action, observer } from 'vendor'
import { NodeSelection } from 'prosemirror-state';
import CustomNodeView from './custom-node-view';
import { v1 as uuidv1 } from 'uuid';
import { Popover, Overlay, Form, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

const ControlsPopOverBody = styled(Popover.Content)`
  width: 300px;
  .btn-group-toggle {
    display: flex;
  }
`

@observer
class ImageViewBody extends React.Component {

  id = uuidv1()
  imgRef = React.createRef()

  static propTypes = {
    selected: PropTypes.bool,
    editorView: PropTypes.any.isRequired,
    getPos: PropTypes.func.isRequired,
    node: PropTypes.any.isRequired,
  }
  

  @action.bound onAlignChange(align) {
    this.saveAttrs({ align })
  }
  
  @action.bound onAltChange({ target: { value} }) {
    this.saveAttrs({ alt: value })
  }

  @action.bound saveAttrs(change) {
    const { getPos, node, editorView } = this.props;
    const attrs = {
      ...node.attrs,
      ...change,
    };

    const pos = getPos();
    
    let tr = editorView.state.tr;
    const { selection } = editorView.state;
    tr = tr.setNodeMarkup(pos, null, attrs);

    const origSelection = NodeSelection.create(
      tr.doc,
      selection.from
    );
    tr = tr.setSelection(origSelection);
    this.props.editorView.dispatch(tr);
  }

  render() {
    const { node, selected } = this.props
    const { align, height, src, width, alt } = node.attrs;

    return (
      <div>
        <Overlay
          show={selected}
          target={this.imgRef.current}
          containerPadding={20}
        >
          <Popover id="popover-edit-img">
            <Popover.Title as="h3">Image Properties</Popover.Title>
            <ControlsPopOverBody>
              <form ref={this.formRef}>
                <Form.Group controlId="alt-text">
                  <Form.Label>Alt Text</Form.Label>
                  <Form.Control type="text" onChange={this.onAltChange} value={alt} />
                </Form.Group>
                <Form.Group controlId="alt-text">
                  <div><Form.Label>Alignment</Form.Label></div>
                  <ToggleButtonGroup value={align} name="align" onChange={this.onAlignChange}>
                    <ToggleButton variant="secondary" type="radio" name="align" value="left">
                      Left
                    </ToggleButton>
                    <ToggleButton variant="secondary" type="radio" name="align" value="center">
                      Fill
                    </ToggleButton>
                    <ToggleButton variant="secondary" type="radio" name="align" value="right">
                      Right
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Form.Group>
              </form>
            </ControlsPopOverBody>
          </Popover>
        </Overlay>

        <img
          ref={this.imgRef}
          alt={alt}
          className="czi-image-view-body-img"
          data-align={align}
          height={height}
          id={`${this.id}-img`}
          src={src}
          width={width}
        />
      </div>
    );
  }
  
}

class ImageNodeView extends CustomNodeView {

  createDOMElement() {
    const el = document.createElement('span');
    el.className = 'image-view';
    this._updateDOM(el);
    return el;
  }

  update(node, decorations) {
    super.update(node, decorations);
    this._updateDOM(this.dom);
    return true;
  }

  renderReactComponent() {
    return <ImageViewBody {...this.props} />;
  }

  _updateDOM(el) {
    const { align } = this.props.node.attrs;
    let className = 'image-view';
    if (align) {
      className += ' align-' + align;
    }
    el.className = className;
  }

}

export default ImageNodeView;
