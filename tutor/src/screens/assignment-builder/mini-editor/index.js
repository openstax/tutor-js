import { React, PropTypes, styled, action } from '../../../helpers/react';
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
  .popover-body {
    padding: 0;
  }
`;

class TaskPlanMiniEditorShell extends React.Component {
  static propTypes = {
    course:   PropTypes.instanceOf(Course).isRequired,
    onHide:   PropTypes.func.isRequired,
    sourcePlan: PropTypes.shape({
      id:   PropTypes.string.isRequired,
      date: PropTypes.object.isRequired,
    }).isRequired,
    findPopOverTarget: PropTypes.func.isRequired,
  };

  state = { isVisible: true };

  calculatePlacement = () => {
    // currently we use fixed positioning.
    // May adjust based on "position" prop at some point
    return 'top';
  };

  handleError = (error) => {
    return this.setState({ error });
  };


  constructor(props) {
    super(props);

    this.ux = new UX();
    this.ux.initialize({
      type: 'clone',
      id: props.sourcePlan.id,
      course: this.props.course,
      onComplete: this.onComplete,
      defaultDueAt: props.sourcePlan.date,
    });
  }

  @action.bound onComplete() {
    this.props.onHide();
  }

  render() {
    const body = this.ux.isInitializing ?
      <Loading message="Loading assignment…" /> : <Editor ux={this.ux} />;

    return (
      <StyledEditorPlacement>
        <Overlay
          show={this.state.isVisible}
          onHide={this.props.onHide}
          placement="auto"
          target={this.props.findPopOverTarget}
        >
          <StyledPopover id="mini-task-editor-popover">
            {body}
          </StyledPopover>
        </Overlay>
      </StyledEditorPlacement>
    );
  }
}

export default TaskPlanMiniEditorShell;
