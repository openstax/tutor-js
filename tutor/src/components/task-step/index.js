import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import { SpyMode } from 'shared';

import { TaskActions, TaskStore } from '../../flux/task';
import { TaskStepActions, TaskStepStore } from '../../flux/task-step';

import { Reading, Interactive, Video, Exercise, Placeholder, ExternalUrl } from './all-steps';
import BindStoreMixin from '../bind-store-mixin';

import { StepCard } from '../../helpers/policies';

// React swallows thrown errors so log them first
const err = function(...msgs) {
  console.error(...Array.from(msgs || []));
  throw new Error(JSON.stringify(...Array.from(msgs || [])));
};

const STEP_TYPES = {
  reading: Reading,
  interactive: Interactive,
  video: Video,
  exercise: Exercise,
  placeholder: Placeholder,
  external_url: ExternalUrl,
};

const getStepType = function(typeName) {
  const type = STEP_TYPES[typeName];
  return type || err('BUG: Invalid task step type', typeName);
};


const TaskStep = createReactClass({
  displayName: 'TaskStep',

  propTypes: {
    id: PropTypes.string.isRequired,
    onNextStep: PropTypes.func.isRequired,
  },

  mixins: [BindStoreMixin],
  bindStore: TaskStepStore,

  onStepCompleted(id) {
    if (id == null) { (({ id } = this.props)); } // need to allow `id` from arguments pass through, especially for multi-part
    const step = TaskStepStore.get(id);
    if (!step.is_completed && StepCard.canWrite(id)) {
      TaskActions.completeStep(id, this.props.taskId);
      return new Promise(function(resolve) { return TaskStore.once('step.completed', resolve); });
    } else {
      return Promise.resolve();
    }
  },

  render() {
    const { id, taskId } = this.props;
    const step = TaskStepStore.get(id);
    if (!step) { return null; }
    const { type, spy: taskStepSpy } = step;
    const { spy: taskSpy } = TaskStore.get(taskId);
    const Type = getStepType(type);
    return (
      <div>
        <Type {...this.props} onStepCompleted={this.onStepCompleted} />
        <SpyMode.Content className="task-spy-info">
          {'\
    TaskId: '}
          {taskId}
          {', TaskSpy: '}
          {JSON.stringify(taskSpy)}
          {`,
    StepId: `}
          {id}
          {', StepSpy: '}
          {JSON.stringify(taskStepSpy)}
        </SpyMode.Content>
      </div>
    );
  },
});


export default TaskStep;
