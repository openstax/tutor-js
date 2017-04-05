import {
  BaseModel, identifiedBy, identifier, hasMany, field, belongsTo,
} from '../base';
import  classnames from 'classnames';
import { observable, computed, action } from 'mobx';
import invariant from 'invariant';

import * as StepComponents from '../../components/task-step/all-steps';

const STEP_TYPES = {
  reading:      StepComponents.Reading,
  interactive:  StepComponents.Interactive,
  video:        StepComponents.Video,
  exercise:     StepComponents.Exercise,
  placeholder:  StepComponents.Placeholder,
  external_url: StepComponents.ExternalUrl,
};

@identifiedBy('task/step-ui')
export default class TaskStepUI extends BaseModel {

  @belongsTo({ model: 'task/step' }) step;

  @computed get component() {
    return STEP_TYPES[this.step.type];
  }

}
