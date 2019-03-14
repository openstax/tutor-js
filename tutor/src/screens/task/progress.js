import { React, PropTypes, observer, action, observable, cn } from '../../helpers/react';
import Overlay from '../../components/obscured-page/overlay';
import PagingNavigation from '../../components/paging-navigation';
import { Milestones } from './milestones';
import UX from './ux';
//import Overlay from '../obscured-page;

//import classnames from 'classnames';
// import createReactClass from 'create-react-class';
// import PureRenderMixin from 'react-addons-pure-render-mixin';
// import keymaster from 'keymaster';

//import { TaskStore, TaskActions } from '../../../flux/task';
// import { StepCard } from '../../../helpers/policies';
// import { TaskStepStore } from '../../../flux/task-step';
// import { TaskPanelStore } from '../../../flux/task-panel';

// import isEqual from 'lodash/isEqual';
// import pick from 'lodash/pick';

export default
@observer
class ProgressCard extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
    children: PropTypes.node.isRequired,
  }

  @observable showMilestones = false;

  // silence React return value warning
  goForward() {
    const { stepId, taskId } = this.props;
    if (stepId && !__guard__(TaskStepStore.get(stepId), x => x.is_completed)) {
      this.setState({ isCompleting: true });
      TaskStore.once('step.completed', () => {
        this.props.goToStep(this.props.stepKey + 1);
        return this.setState({ isCompleting: false });
      });
      TaskActions.completeStep(stepId, taskId);
    } else {
      this.props.goToStep(this.props.stepKey + 1);
    }
    return undefined;
  }

  // silence React return value warning
  goBackward() {
    this.props.goToStep(this.props.stepKey - 1);
    return undefined;
  }

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
    const { ux, children, ux: { task } } = this.props;

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
