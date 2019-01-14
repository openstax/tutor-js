import PropTypes from 'prop-types';
import React from 'react';
import { extend } from 'lodash';
import { observer } from 'mobx-react';

import ReadingCell from './reading-cell';
import HomeworkCell from './homework-cell';
import AbsentCell from './absent-cell';
import ExternalCell from './external-cell';
import UX from './ux';

export default
@observer
class AssignmentCell extends React.Component {
  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
    rowIndex: PropTypes.number,
    columnIndex: PropTypes.number.isRequired,
  }

  render() {
    const { ux, rowIndex } = this.props;
    const student = ux.students[rowIndex || 0];
    const props = extend({}, this.props, {
      student,
      task: student.data[this.props.columnIndex],
      headings: ux.period.data_headings,
    });

    switch (props.task.type) {
    case 'external': return <ExternalCell key="extern" {...props} />;
    case 'reading': return <ReadingCell key="reading" {...props} />;
    case 'homework': return <HomeworkCell key="homework" {...props} />;
    default: return <AbsentCell key="absent" {...props} />;
    }
  }
};
