import React from 'react';
import createReactClass from 'create-react-class';
import StepFooterMixin from './step-footer-mixin';

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
