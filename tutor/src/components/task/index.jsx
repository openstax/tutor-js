import React from 'react';
import { computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { isEmpty } from 'lodash';
import Router from '../../helpers/router';
import LoadableModel from '../loadable-model';
import ProgressPanel from './progress/panel';

import TaskUI from '../../models/task/ui';
import TaskModel from '../../models/task';

import { PinnedHeaderFooterCard, PinnedHeader, ScrollToMixin, ExerciseIntro } from 'shared';

import TaskStep from '../task-step';

@observer
export class Task extends React.PureComponent {

  static propTypes = {
    task: React.PropTypes.instanceOf(TaskModel).isRequired,
    courseId: React.PropTypes.string.isRequired,
  }

  @observable ui = new TaskUI({ task: this.props.task });

  get task() { return this.props.task; }
  //
  //   renderStep(step) {
  //     const { courseId } = Router.currentParams()
  //     const { id } = this.props;
  //
  //     return (
  //       <TaskStep
  //         id={step.id}
  //         taskId={id}
  //         courseId={courseId}
  //         goToStep={this.goToStep}
  //         onNextStep={this.onNextStep}
  //         refreshStep={this.refreshStep}
  //         pinned={step.isPinned}
  //       />
  //     );
  //   }
  //
  render() {
    const { ui } = this;
    if (isEmpty(this.task.steps)) { return null; }

    const { currentStepUI: { component: StepComponent } } = ui;
    return (
      <PinnedHeaderFooterCard
        className={ui.classNames}
        fixedOffset={0}
        header={this.breadCrumbs}
        cardType="task"
      >
        {this.teacherReviewControls}
        <ProgressPanel
          taskUI={this.ui}
          enableKeys={!ui.isShowingMilestones}
        >
          <StepComponent step={ui.currentStep} />
        </ProgressPanel>
      </PinnedHeaderFooterCard>

    );
  }

  get isShowingMilestones() {
    return !!Router.currentParams().milestones;
  }

  @computed get teacherReviewControls() {
    if (!this.ui.showTeacherReviewControls){ return null; }
    return (
      <TeacherReviewControls
        task={this.task}
        courseId={this.props.courseId} />
    );
  }

  @computed get breadCrumbs() {
    if (!this.ui.hasBreadCrumbs){ return null; }
    return (
      <Breadcrumbs
        id={this.task.id}
        goToStep={this.ui.setCurrentStep}
        key={`task-${this.task.id}-breadcrumbs`}
      />
    );
  }

}


export class TaskShell extends React.PureComponent {

  static propTypes = {
    params: React.PropTypes.shape({
      id: React.PropTypes.string,
    }).isRequired,
  }

  task = new TaskModel({
    id: this.props.params.id,
  });

  render() {
    const { courseId } = Router.currentParams();
    return (
      <LoadableModel
        model={this.task}
        renderItem={() => <Task task={this.task} courseId={courseId} />}
      />
    );
  }
}


// import React from 'react';
// import ReactDOM from 'react-dom';
// import BS from 'react-bootstrap';
//
// import _ from 'underscore';
// import classnames from 'classnames';
//
// import { TaskActions, TaskStore } from '../../flux/task';
// import { TaskStepActions, TaskStepStore } from '../../flux/task-step';
// import { TaskPanelActions, TaskPanelStore } from '../../flux/task-panel';
// import { TaskProgressActions, TaskProgressStore } from '../../flux/task-progress';
// import { CourseStore } from '../../flux/course';
//
// import StepFooterMixin from '../task-step/step-footer-mixin';
// import Router from '../../helpers/router';
// import TaskStep from '../task-step';
// import Ends from '../task-step/ends';
// import Breadcrumbs from './breadcrumbs';
//
// import TaskProgress from './progress';
// import ProgressPanel from './progress/panel';
// import { Milestones, Milestone } from './progress/milestones';
// import TeacherReviewControls from './teacher-review-controls';
//
// import { StepPanel } from '../../helpers/policies';
//
// import { UnsavedStateMixin } from '../unsaved-state';
// import LoadableItem from '../loadable-item';
//
// import { PinnedHeaderFooterCard, PinnedHeader, ScrollToMixin, ExerciseIntro } from 'shared';
//
// const Task = React.createClass({
//
//   displayName: 'Task',
//
//   propTypes: {
//     id: React.PropTypes.string
//   },
//
//   // Book and Project context is used by the exercise identifier link which
//   // deeply nested and impractical to pass through the tree.
//   childContextTypes: {
//     bookUUID:  React.PropTypes.string,
//     oxProject: React.PropTypes.string
//   },
//
//   getChildContext() {
//     const {courseId} = Router.currentParams();
//     return (
//         {
//           bookUUID: CourseStore.getBookUUID(courseId),
//           oxProject: 'tutor'
//         }
//     );
//   },
//
//   contextTypes: {
//     router: React.PropTypes.object
//   },
//
//   mixins: [StepFooterMixin, UnsavedStateMixin, ScrollToMixin],
//
//   scrollingTargetDOM() { return window.document; },
//
//   getDefaultCurrentStep() {
//     return (
//         TaskPanelStore.getStepKey(this.props.id, {is_completed: false})
//     );
//   },
//
//   setStepKey() {
//     const params = Router.currentParams();
//
//     // url is 1 based so it matches the breadcrumb button numbers
//     const defaultKey = this.getDefaultCurrentStep();
//     const stepKey = params.stepIndex ? parseInt(params.stepIndex) : defaultKey;
//     const stepIndex = stepKey - 1;
//
//     const step = TaskPanelStore.getStep(this.props.id, stepIndex);
//     TaskProgressActions.update(this.props.id, stepIndex);
//
//     // go ahead and render this step only if this step is accessible
//     if (step != null) {
//       return (
//           this.setState({currentStep: stepIndex})
//       );
//     // otherwise, redirect to the latest accessible step
//     } else {
//       return (
//           this.goToStep(defaultKey, true)
//       );
//     }
//   },
//
//   getInitialState() {
//     return (
//         {
//           currentStep: 0,
//           refreshFrom: false,
//           refreshTo: false,
//           recoverForStepId: false,
//           recoveredStepId: false,
//           milestonesEntered: false
//         }
//     );
//   },
//
//   hasUnsavedState() { return TaskStore.hasAnyStepChanged(this.props.id); },
//   unsavedStateMessages() { return 'The assignment has unsaved changes'; },
//
//   componentWillMount() {
//     this.updateSteps();
//     this.setStepKey();
//     TaskStepStore.on('step.recovered', this.prepareToRecover);
//     TaskStepStore.on('step.completed', this.updateSteps);
//     return (
//         TaskStore.on('loaded', this.updateTask)
//     );
//   },
//
//   componentWillUnmount() {
//     TaskStepStore.off('step.recovered', this.prepareToRecover);
//     TaskStepStore.off('step.completed', this.updateSteps);
//     return (
//         TaskStore.off('loaded', this.updateTask)
//     );
//   },
//
//   componentWillReceiveProps() {
//     return (
//         this.setStepKey()
//     );
//   },
//
//   updateSteps() {
//     return (
//         TaskPanelActions.sync(this.props.id)
//     );
//   },
//
//   updateTask(id) {
//     if (id === this.props.id) { return this.updateSteps(); }
//   },
//
//   _stepRecoveryQueued(nextState) {
//     return (
//         !this.state.recoverForStepId && nextState.recoverForStepId
//     );
//   },
//
//   _stepRecovered(nextState) {
//     return (
//         !this.state.recoveredStepId && nextState.recoveredStepId
//     );
//   },
//
//   _taskRecoveredStep(nextState) {
//     return (
//         this.state.recoveredStepId && !nextState.recoveredStepId
//     );
//   },
//
//   _leavingRefreshingStep(nextState) {
//     return (
//         this.state.refreshTo && !(nextState.currentStep === this.state.refreshTo)
//     );
//   },
//
//   _isSameStep(nextProps, nextState) {
//     if (nextProps.id !== this.props.id) { return false; }
//     const step = this.getStep(this.state.currentStep);
//     const nextStep = this.getStep(nextState.currentStep);
//     if (_.isEmpty(step) || _.isEmpty(nextStep)) { return false; }
//     return (
//         TaskStore.isSameStep(this.props.id, step.id, nextStep.id)
//     );
//   },
//
//   // After a step is recovered, the task needs to load itself in order to store the new step
//   // at the proper index.  prepareToRecover handles this.
//   //
//   // prepareToRecover will
//   //   emit task.beforeRecovery to stop breadcrumbs from showing the outdated future crumbs
//   //   begin listening for when the recovered step has been loaded into the task
//   //   and set the recoveredStepId for later use
//   //
//   // Setting the recoveredStepId will trigger the task to load itself in shouldComponentUpdate
//   prepareToRecover(recoveredStep) {
//     const {id} = recoveredStep;
//     TaskStore.emit('task.beforeRecovery', id);
//     TaskStepStore.on('step.loaded', this.recoverStep);
//     return (
//         this.setState({recoveredStepId: id})
//     );
//   },
//
//   shouldComponentUpdate(nextProps, nextState) {
//     const {id} = this.props;
//
//     // if a step needs to be recovered, load a recovery step for it
//     if (this._stepRecoveryQueued(nextState)) {
//       return (
//           false
//       );
//     }
//
//     // if the recoveredStepId is being set, load the task again
//     // so that it will load the recoveredStep as one of it's steps
//     if (this._stepRecovered(nextState)) {
//       TaskActions.load(id);
//       return (
//           false
//       );
//     }
//
//     // if the recoveredStepId is being unset, then the step has been loaded into the task.
//     //   if we are not refreshing our memory, go to this recovered step, which is the next step.
//     //   Emit afterRecovery so that the breadcrumbs update with the new recovered step as the next crumb
//     if (this._taskRecoveredStep(nextState)) {
//       if (!this.state.refreshTo) { this.onNextStep(); }
//       TaskStore.emit('task.afterRecovery', id);
//       return (
//           false
//       );
//     }
//
//     // if we are trying to leave the refresh step,
//     //   redirect to the step after the step we triggered refresh from.
//     if (this._leavingRefreshingStep(nextState)) {
//       this.continueAfterRefreshStep();
//       return (
//           false
//       );
//     }
//
//     if ((this.state.currentStep !== nextState.currentStep) && this._isSameStep(nextProps, nextState)) {
//       return (
//           false
//       );
//     }
//
//     // if we reach this point, assume that we should go ahead and do a normal component update
//     return (
//         true
//     );
//   },
//
//   // on refresh clicked and refresh step loaded, go to the refreshing step
//   // also, ask the step to be recovered.  this will trigger loadRecovery to be called within shouldComponentUpdate
//   refreshStep(refreshTo, stepId) {
//     this.setState({refreshFrom: this.state.currentStep, refreshTo, recoverForStepId: stepId});
//     return (
//         this.goToStep(refreshTo)
//     );
//   },
//
//   // on leaving refresh step, go to the step after the step that triggered the refresh and clear related states.
//   // the step after should be the recovered step!
//   continueAfterRefreshStep() {
//     this.goToStep(this.state.refreshFrom + 1);
//     return (
//         this.setState({refreshFrom: false, refreshTo: false, recoverForStepId: false})
//     );
//   },
//
//   // set what step needs to be recovered.  this will trigger loadRecovery.
//   recoverFor(stepId) {
//     this.setState({recoverForStepId: stepId});
//     return (
//         TaskStepActions.loadRecovery(stepId)
//     );
//   },
//
//   // if the step loaded is the recovered step, unset the recoveredStepId and stop listening for steps loaded
//   // when the recoveredStepId is unset, then shouldComponentUpdate will see that the step has been loaded.
//   recoverStep(loadedStepId) {
//     if (loadedStepId === this.state.recoveredStepId) {
//       this.setState({recoveredStepId: false});
//       return (
//           TaskStepStore.off('step.loaded', this.recoverStep)
//       );
//     }
//   },
//
//   areKeysSame(key, keyToCompare) {
//     return (
//         (key === keyToCompare) || (parseInt(key) === parseInt(keyToCompare))
//     );
//   },
//
//   goToStep(stepKey, silent) {
//     if (silent == null) { silent = false; }
//     const {id} = this.props;
//     stepKey = parseInt(stepKey);
//     const params = _.clone(Router.currentParams());
//     if (this.areKeysSame(this.state.currentStep, stepKey)) { return false; }
//     // url is 1 based so it matches the breadcrumb button numbers
//     params.stepIndex = stepKey + 1;
//     params.id = id; // if we were rendered directly, the router might not have the id
//
//     if (!this._isSameStep({id}, {currentStep: stepKey})) { this.scrollToTop(); }
//
//     if (silent) {
//       this.context.router.replaceWith(Router.makePathname('viewTaskStep', params));
//     } else {
//       this.context.router.transitionTo(Router.makePathname('viewTaskStep', params));
//     }
//
//     return (
//
//         true
//
//     );
//   },
//
//   toggleMilestonesEntered() {
//     return (
//         this.setState({milestonesEntered: !this.state.milestonesEntered})
//     );
//   },
//
//   closeMilestones() {
//     const params = Router.currentParams();
//     return (
//         this.context.router.transitionTo(
//           Router.makePathname('viewTaskStep', params)
//         )
//     );
//   },
//
//   filterClickForMilestones(focusEvent) {
//     const stepPanel = ReactDOM.findDOMNode(this.refs.stepPanel);
//     return (
//         !__guard__(stepPanel, x => x.contains(focusEvent.target))
//     );
//   },
//
//   getStep(stepIndex) {
//     return (
//         TaskPanelStore.getStep(this.props.id, stepIndex)
//     );
//   },
//
//   shouldShowTeacherReviewControls(panelType) {
//     const {id} = this.props;
//
//     return (
//
//         (panelType === 'teacher-read-only') && TaskStore.hasProgress(id)
//
//     );
//   },
//
//   renderStep(data) {
//     const {courseId} = Router.currentParams();
//     const {id} = this.props;
//     const pinned = !TaskStore.hasProgress(id);
//
//     return (
//
//         <TaskStep
//           id={data.id}
//           taskId={this.props.id}
//           courseId={courseId}
//           goToStep={this.goToStep}
//           onNextStep={this.onNextStep}
//           refreshStep={this.refreshStep}
//           recoverFor={this.recoverFor}
//           pinned={pinned}
//           ref="stepPanel" />
//
//     );
//   },
//
//   renderDefaultEndFooter() {
//     const {id} = this.props;
//     const {courseId} = Router.currentParams();
//
//     const taskFooterParams = {
//       taskId: id,
//       courseId
//     };
//
//     return (
//
//         this.renderEndFooter(taskFooterParams)
//
//     );
//   },
//
//   renderEnd(data) {
//     let panel;
//     const {id} = this.props;
//     const {courseId} = Router.currentParams();
//     const task = TaskStore.get(id);
//
//     const type = task.type ? task.type : 'task';
//     const End = Ends.get(type);
//
//     const footer = this.renderDefaultEndFooter();
//
//     return (
//
//         panel = <End
//           courseId={courseId}
//           taskId={id}
//           reloadPractice={this.reloadTask}
//           footer={footer}
//           ref="stepPanel" />
//
//     );
//   },
//
//   renderStatics(data) {
//     const {courseId} = Router.currentParams();
//     const pinned = !TaskStore.hasProgress(this.props.id);
//
//     return (
//
//         <ExerciseIntro
//           project="tutor"
//           pinned={pinned}
//           stepIntroType={data.type}
//           onNextStep={this.onNextStep}
//           onContinue={this.onNextStep}
//           taskId={this.props.id}
//           className={data.type}
//           courseId={courseId} />
//
//     );
//   },
//
//   // add render methods for different panel types as needed here
//
//   render() {
//     let header, panel;
//     const {id} = this.props;
//     const {milestonesEntered} = this.state;
//     const {courseId} = Router.currentParams();
//     const showMilestones = (Router.currentParams().milestones != null);
//     const task = TaskStore.get(id);
//     if (task == null) { return null; }
//
//     // get the crumb that matches the current state
//     const step = this.getStep(this.state.currentStep);
//     const panelType = StepPanel.getPanel(this.state.currentStep);
//
//     if (step.id) {
//       panel = this.renderStep(step);
//     } else if (step.type === 'end') {
//       panel = this.renderEnd(step);
//     } else {
//       panel = this.renderStatics(step);
//     }
//
//     let taskClasses = classnames('task', `task-${task.type}`, {
//       [`task-${panelType}`]: (panelType != null),
//       'task-completed': TaskStore.isTaskCompleted(id)
//     }
//     );
//
//     if (TaskStore.hasCrumbs(id)) {
//       const breadcrumbs = <Breadcrumbs id={id} goToStep={this.goToStep} key={`task-${id}-breadcrumbs`} />;
//       header = breadcrumbs;
//     }
//
//     if (TaskStore.hasProgress(id)) {
//
//       header = <TaskProgress taskId={id} stepIndex={this.state.currentStep} key="task-progress" />;
//       const milestones = <Milestones
//         id={id}
//         goToStep={this.goToStep}
//         closeMilestones={this.closeMilestones}
//         filterClick={this.filterClickForMilestones}
//         handleTransitions={this.toggleMilestonesEntered}
//         showMilestones={showMilestones} />;
//
//       panel = <ProgressPanel
//         taskId={id}
//         stepId={__guard__(step, x => x.id)}
//         goToStep={this.goToStep}
//         isSpacer={(step.id == null) && (step.type !== 'end')}
//         stepKey={this.state.currentStep}
//         enableKeys={!showMilestones}>
//         {milestones}
//         {panel}
//       </ProgressPanel>;
//
//       taskClasses = classnames(taskClasses, 'task-with-progress', {
//         'task-with-milestones': showMilestones,
//         'task-with-milestones-entered': milestonesEntered && showMilestones
//       }
//       );
//     }
//
//     return (
//
//         <PinnedHeaderFooterCard className={taskClasses} fixedOffset={0} header={header} cardType="task">
//           {this.shouldShowTeacherReviewControls(panelType) ? <TeacherReviewControls taskId={id} courseId={courseId} /> : undefined}
//           {panel}
//         </PinnedHeaderFooterCard>
//
//     );
//   },
//
//   reloadTask() {
//     return (
//         this.setState({currentStep: 0})
//     );
//   },
//
//   onNextStep(state) {
//     let {currentStep} = (state != null);
//     if (currentStep == null) { ({ currentStep } = this.state); }
//     return (
//         this.goToStep(currentStep + 1)
//     );
//   }
// });
//
//
// const TaskShell = React.createClass({
//   displayName: 'TaskShell',
//   render() {
//     const {id} = this.props.params;
//     return (
//         <LoadableItem
//           id={id}
//           store={TaskStore}
//           actions={TaskActions}
//           renderItem={function() { return <Task key={id} id={id} />
//     ); }} />;
//   }
// });
//
// export { Task, TaskShell };
//
// function __guard__(value, transform) {
//   return (
//       (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined
//   );
// }
