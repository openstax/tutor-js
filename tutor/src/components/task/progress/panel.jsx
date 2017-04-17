import React from 'react';

import TaskUI from '../../../models/task/ui';
import PagingNavigation from '../../paging-navigation';

export default class TaskProgressPanel extends React.PureComponent {
  static propTypes = {
    taskUI: React.PropTypes.instanceOf(TaskUI).isRequired,
    enableKeys: React.PropTypes.bool.isRequired,
    children: React.PropTypes.node.isRequired,
  }

  render() {
    const { taskUI: ui, enableKeys } = this.props;

    return (
      <PagingNavigation
        className="progress-panel"
        enableKeys={enableKeys}
        isForwardEnabled={ui.canGoForward}
        isBackwardEnabled={ui.canGoBackward}
        onForwardNavigation={ui.goForward}
        onBackwardNavigation={ui.goBackward}
      >
        {this.props.children}
      </PagingNavigation>
    );

  }

}


  // import React from 'react';
  // import PureRenderMixin from 'react-addons-pure-render-mixin';
  //
  // import keymaster from 'keymaster';
  //
  // import PagingNavigation from '../../paging-navigation';
  //
  // import { TaskStore } from '../../../flux/task';
  // import { StepPanel } from '../../../helpers/policies';
  // import { TaskStepStore, TaskStepActions } from '../../../flux/task-step';
  //
  // const ProgressPanel = React.createClass({
  //   propTypes: {
  //     taskId: React.PropTypes.string,
  //     stepId: React.PropTypes.string,
  //     stepKey: React.PropTypes.number,
  //     goToStep: React.PropTypes.func,
  //   },
  //
  //   mixins: [PureRenderMixin],
  //
  //   getInitialState() {
  //     return (
  //         this.getShouldShows()
  //     );
  //   },
  //
  //   componentWillUnmount() {
  //     return (
  //         TaskStepStore.off('step.completed', this.updateShouldShows)
  //     );
  //   },
  //
  //   componentWillMount() {
  //     return (
  //         TaskStepStore.on('step.completed', this.updateShouldShows)
  //     );
  //   },
  //
  //   componentWillReceiveProps(nextProps) {
  //     return (
  //         this.setState(this.getShouldShows(nextProps))
  //     );
  //   },
  //
  //   getShouldShows(props) {
  //     if (props == null) { ({ props } = this); }
  //     const { stepKey, stepId, isSpacer } = props;
  //     return (
  //     {
  //       shouldShowLeft: stepKey > 0,
  //       shouldShowRight: isSpacer || ((stepId != null) && StepPanel.canForward(stepId)),
  //     }
  //     );
  //   },
  //
  //   updateShouldShows() {
  //     return (
  //         this.setState(this.getShouldShows())
  //     );
  //   },
  //
  //   goForward() {
  //     const { stepId } = this.props;
  //     if (stepId && !__guard__(TaskStepStore.get(stepId), x => x.is_completed)) {
  //       TaskStepStore.once('step.completed', () => {
  //         return (
  //             this.props.goToStep(this.props.stepKey + 1)
  //         );
  //       }
  //       );
  //       TaskStepActions.complete(stepId);
  //     } else {
  //       this.props.goToStep(this.props.stepKey + 1);
  //     }
  //     return (
  //         undefined
  //     ); // silence React return value warning
  //   },
  //
  //   goBackward() {
  //     this.props.goToStep(this.props.stepKey - 1);
  //     return (
  //         undefined
  //     ); // silence React return value warning
  //   },
  //
  //   render() {
  //     return (
  //       <PagingNavigation
  //         className="progress-panel"
  //         enableKeys={this.props.enableKeys}
  //         isForwardEnabled={this.state.shouldShowRight}
  //         isBackwardEnabled={this.state.shouldShowLeft}
  //         onForwardNavigation={this.goForward}
  //         onBackwardNavigation={this.goBackward}>
  //         {this.props.children}
  //       </PagingNavigation>
  //     );
  //   },
  // });
  //
  // export default ProgressPanel;
  //
  // function __guard__(value, transform) {
  //   return (
  //       (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined
  //   );
  // }
