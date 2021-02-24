import {
    React, PropTypes, styled, observer,
} from 'vendor';
import { Overlay, Popover } from 'react-bootstrap';
import Loading from 'shared/components/loading-animation';
import Editor from './editor';
import Course from '../../../models/course';
import UX from '../ux';

const StyledEditorPlacement = styled.div`
  padding: 0;
`;

const StyledPopover = styled(Popover)`
  min-width: 450px;
  max-width: 450px;
  max-height: 320px;
  .loading-animation svg {
    max-height: 200px;
  }
  height: 320px;
  .popover-body {
    padding: 0;
  }
`;

@observer
class CloneAssignment extends React.Component {
  static propTypes = {
      course:   PropTypes.instanceOf(Course).isRequired,
      onHide:   PropTypes.func.isRequired,
      sourcePlan: PropTypes.shape({
          id:   PropTypes.string.isRequired,
          date: PropTypes.object.isRequired,
      }).isRequired,
      history: PropTypes.object.isRequired,
  };

  constructor(props) {
      super(props);
      this.ux = new UX();
      this.ux.initialize({
          type: 'clone',
          id: props.sourcePlan.id,
          course: this.props.course,
          due_at: props.sourcePlan.date,
          history: props.history,
      });
  }

  render() {
      const { onHide } = this.props;
      return (
      <>
        <StyledEditorPlacement>
            <Overlay
                show={this.ux.isInitializing && !this.ux.isReady}
                onHide={this.props.onHide}
                placement="auto"
            >
                <StyledPopover id="mini-task-editor-popover">
                    <Popover.Content>
                        <Loading message="Loading assignment…" />
                    </Popover.Content>
                </StyledPopover>
            </Overlay>
        </StyledEditorPlacement>     
        <Editor onHide={onHide} ux={this.ux} showModal={!this.ux.isInitializing && this.ux.isReady} />
      </>

      );
  }
}

export default CloneAssignment;
