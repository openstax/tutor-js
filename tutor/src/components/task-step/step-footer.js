import React from 'react';
import createReactClass from 'create-react-class';
import BS from 'react-bootstrap';
import _ from 'underscore';
import { StepCard } from '../../helpers/policies';

import { TaskStore } from '../../flux/task';
import StepFooterMixin from './step-footer-mixin';

import { TaskStepStore } from '../../flux/task-step';

const StepFooter = createReactClass({
  displayName: 'StepFooter',
  mixins: [StepFooterMixin],

  getDefaultProps() {
    return { controlButtons: null };
  },

  renderFooterButtons() {
    const { controlButtons, panel } = this.props;
    if (panel !== 'teacher-read-only') { return controlButtons; }
  },

  render() {
    const { pinned, courseId, id, taskId, review } = this.props;

    return (
      <div className="-step-footer">
        {this.renderFooter({ stepId: id, taskId, courseId, review })}
      </div>
    );
  },
});

export default StepFooter;
