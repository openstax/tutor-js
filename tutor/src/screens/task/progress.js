import { React, PropTypes, observer, action, cn } from 'vendor';
import { Milestones } from './milestones';
import UX from './ux';
import MilestonesToggle from './reading-milestones-toggle';
import { Modal } from 'react-bootstrap';

export default
@observer
class ProgressCard extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
  }

  @action.bound closeMilestones() {
    MilestonesToggle.isActive = false;
  }

  @action.bound renderMilestones() {
    const { ux } = this.props;

    return (
      <Milestones
        ux={ux}
        id={ux.task.id}
        onHide={this.closeMilestones}
      />
    );
  }

  render() {
    return (
      <Modal
        dialogClassName={cn('task-milestones', 'openstax-wrapper')}
        show={MilestonesToggle.isActive}
        onHide={this.closeMilestones}
        scrollable={true}
      >
        <Modal.Header
          closeButton={true}
          closeLabel={'Close'}
        >
          <Modal.Title>Overview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.renderMilestones()}
        </Modal.Body>
      </Modal>

    );
  }
}
