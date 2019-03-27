import { React, PropTypes, observer, action, observable, cn } from '../../helpers/react';
import Overlay from '../../components/obscured-page/overlay';
import PagingNavigation from '../../components/paging-navigation';
import { Milestones } from './milestones';
import UX from './ux';

export default
@observer
class ProgressCard extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
    children: PropTypes.node.isRequired,
  }

  @observable showMilestones = false;

  @action.bound closeMilestones() {
    this.showMilestones = false;
  }

  @action.bound renderMilestones() {
    const { ux } = this.props;
    return (
      <Milestones
        id={ux.task.id}
        goToStep={ux.goToStep}
        filterClick={this.filterClickForMilestones}
        handleTransitions={this.toggleMilestonesEntered}
        showMilestones={this.showMilestones}
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
          visible={this.showMilestones}
          onHide={this.closeMilestones}
          renderer={this.renderMilestones}
        />
        {children}
      </PagingNavigation>
    );
  }
}
