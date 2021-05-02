import { React, PropTypes, observer, action, cn, styled, modelize } from 'vendor';
import { Milestones } from './milestones';
import UX from './ux';
import MilestonesToggle from './reading-milestones-toggle';
import { Modal } from 'react-bootstrap';
import { breakpoint } from 'theme';

const { margins } = breakpoint;

const StyledModal = styled(Modal)`
  & .modal-dialog.task-milestones {
    ${breakpoint.tablet`
      margin: ${margins.tablet} auto;
      width: calc(100% - ${margins.tablet});
      height: calc(100% - ${margins.tablet});
    `}
    ${breakpoint.mobile`
      margin: ${margins.mobile} auto;
      width: calc(100% - ${margins.mobile});
      height: calc(100% - ${margins.mobile} * 2);
      .modal-header {
        padding: ${margins.mobile};
      }
      .modal-title {
        font-size: 1.4rem;
        font-weight: bold;
      }
    `}
    .modal-body {
      ${breakpoint.tablet`
        padding: ${margins.tablet} calc(${margins.tablet} - 15px);
      `}
      ${breakpoint.mobile`
        padding: ${margins.mobile} 0;
        .milestone-wrapper {
          padding: 0 ${margins.mobile};
          .milestone {
            margin-bottom: calc(${margins.mobile} * 2);
          }
        }
      `}
    }
  }
`;


@observer
export default class ProgressCard extends React.Component {
    static propTypes = {
        ux: PropTypes.instanceOf(UX).isRequired,
    }

    constructor(props) {
        super(props);
        modelize(this);
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
