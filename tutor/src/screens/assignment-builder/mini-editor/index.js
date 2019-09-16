import {
  React, PropTypes, styled, action, observer, observable,
} from '../../../helpers/react';
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

@observer
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

  @observable isVisible = true;

  constructor(props) {
    super(props);
    this.ux = new UX();
    this.ux.initialize({
      type: 'clone',
      id: props.sourcePlan.id,
      course: this.props.course,
      onComplete: this.onComplete,
      due_at: props.sourcePlan.date,
    });
  }

  @action.bound onComplete() {
    this.isVisible = false;
    this.props.onHide();
  }

  render() {
    const { onHide } = this.props;

    const body = this.ux.isInitializing ?
      <Loading message="Loading assignment…" /> : <Editor onHide={onHide} ux={this.ux} />;

    return (
      <StyledEditorPlacement>
        <Overlay
          show={this.isVisible}
          onHide={this.props.onHide}
          placement="auto"
          target={this.props.findPopOverTarget}
        >
          <StyledPopover id="mini-task-editor-popover">
            <Popover.Content>
              {body}
            </Popover.Content>
          </StyledPopover>
        </Overlay>
      </StyledEditorPlacement>
    );
  }
}

export default TaskPlanMiniEditorShell;
