import React from 'react';
import BS from 'react-bootstrap';
import _ from 'underscore';
import { StepPanel } from '../../helpers/policies';

import { AsyncButton, CardBody } from 'shared';

class StepCard extends React.Component {
  static displayName = 'StepCard';

  render() {
    const { pinned, courseId, id, taskId, review, children, footer } = this.props;

    // from StepFooterMixin
    // footer = @renderFooter({stepId: id, taskId, courseId, review})
    return (
      <CardBody className="task-step" footer={footer} pinned={pinned}>
        {children}
      </CardBody>
    );
  }
}

export default StepCard;
