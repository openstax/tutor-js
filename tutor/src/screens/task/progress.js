import { React, PropTypes, observer, action, cn } from 'vendor';
import Overlay from '../../components/obscured-page/overlay';
import PagingNavigation from '../../components/paging-navigation';
import { Milestones } from './milestones';
import UX from './ux';
import MilestonesToggle from '../../components/navbar/milestones-toggle';

export default
@observer
class ProgressCard extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
    children: PropTypes.node.isRequired,
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
    const { ux, children } = this.props;

    return (
      <PagingNavigation
        className={cn('progress-panel')}
        enableKeys={!this.showMilestones}
        isForwardEnabled={ux.canGoForward}
        isBackwardEnabled={ux.canGoBackward}
        onForwardNavigation={ux.goForward}
        onBackwardNavigation={ux.goBackward}
        titles={ux.relatedStepTitles}
      >
        <Overlay
          id="task-milestones"
          visible={MilestonesToggle.isActive}
          renderer={this.renderMilestones}
          onHide={this.closeMilestones}
        />
        {children}
      </PagingNavigation>
    );
  }
}
