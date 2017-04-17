import {
  BaseModel, identifiedBy, identifier, hasMany, field, belongsTo,
} from '../base';
import  classnames from 'classnames';
import { observable, computed, action } from 'mobx';
import invariant from 'invariant';

import StepUI from './step-ui';

@identifiedBy('task/ui')
export default class TaskUI extends BaseModel {

  @belongsTo({ model: 'task' }) task;

  @computed get hasBreadCrumbs() {
    return this.task.steps.length > 1 && !['external', 'reading'].includes(this.task.type);
  }

  @computed get classNames() {
    return classnames('task', `task-${this.task.type}`);
  }

  @observable isShowingMilestones;

  @computed get currentStep() {
    return this.task.allSteps[this._currentStepIndex];
  }

  @computed get canGoForward() { return this._currentStepIndex < this.task.allSteps.length - 1; }
  @computed get canGoBackward() { return this._currentStepIndex > 0; }

  @action.bound goForward() { this.setCurrentStep(this._currentStepIndex + 1); }
  @action.bound goBackward() { this.setCurrentStep(this._currentStepIndex - 1); }


  @computed get currentStepUI() {
    return this.currentStep ? new StepUI({ step: this.currentStep }) : null;
  }

  @computed get currentPanelType() {
    return this.currentStep.type;
  }

  @computed get showTeacherReviewControls() {
    return false;
  }

  // privateish things

  @action.bound
  setCurrentStep(stepIndex) {
    invariant(this.task.allSteps[stepIndex], `Step index ${stepIndex} is invalid`);
    this._currentStepIndex = stepIndex;
  }


  @observable _currentStepIndex = 0;

}
