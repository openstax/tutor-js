import { React, PropTypes, observer, action, cn, styled } from 'vendor';
import { Milestones } from './milestones';
import UX from './ux';
import MilestonesToggle from './reading-milestones-toggle';
import { Modal } from 'react-bootstrap';
import { breakpoint } from 'theme';

const StyledModal = styled(Modal)`
  & .modal-dialog.task-milestones {
    ${breakpoint.tablet`
      margin: ${breakpoint.margins.tablet} auto;
      width: calc(100% - ${breakpoint.margins.tablet});
      height: calc(100% - ${breakpoint.margins.tablet});
    `}
    ${breakpoint.mobile`
      margin: ${breakpoint.margins.mobile} auto;
      width: calc(100% - ${breakpoint.margins.mobile});
      height: calc(100% - ${breakpoint.margins.mobile} * 2);
      .modal-header {
        padding: ${breakpoint.margins.mobile};
      }
      .modal-title {
        font-size: 1.4rem;
        font-weight: bold;
      }
    `}
    .modal-body {
      ${breakpoint.tablet`
        padding: ${breakpoint.margins.tablet} calc(${breakpoint.margins.tablet} - 15px);
      `}
      ${breakpoint.mobile`
        padding: ${breakpoint.margins.mobile} 0;
        .milestone-wrapper {
          padding: 0 ${breakpoint.margins.mobile};
          .milestone {
            margin-bottom: calc(${breakpoint.margins.mobile} * 2);
          }
        }
      `}
    }
  }
`;

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
      <StyledModal
        dialogClassName={cn('task-milestones', 'openstax-wrapper')}
        show={MilestonesToggle.isActive}
        onHide={this.closeMilestones}
        scrollable={true}
      >
        <Modal.Header
          closeButton={true}
          closeLabel={'Close'}
        >
          <Modal.Title>Assignment Overview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.renderMilestones()}
        </Modal.Body>
      </StyledModal>

    );
  }
}
