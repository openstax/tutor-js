import React from 'react';
import { extend } from 'lodash';
import { observer } from 'mobx-react';

import ReadingCell from './reading-cell';
import HomeworkCell from './homework-cell';
import AbsentCell from './absent-cell';
import ExternalCell from './external-cell';
import ConceptCoachCell from './concept-coach-cell';
import UX from './ux';

@observer
export default class AssignmentCell extends React.PureComponent {
  static propTypes = {
    ux: React.PropTypes.instanceOf(UX).isRequired,
    students: React.PropTypes.array.isRequired,
    rowIndex: React.PropTypes.number,
    columnIndex: React.PropTypes.number.isRequired,
  }

  render() {
    const { ux, students, rowIndex } = this.props;
    const student = students[rowIndex || 0];

    const props = extend({}, this.props, {
      student,
      task: student.data[this.props.columnIndex],
      headings: ux.period.data_headings,
    });

    switch (props.task ? props.task.type : 'null') {
    case 'null': return <AbsentCell key="absent" {...props} />;
    case 'external': return <ExternalCell key="extern" {...props} />;
    case 'reading': return <ReadingCell key="reading" {...props} />;
    case 'homework': return <HomeworkCell key="homework" {...props} />;
    default: return <ConceptCoachCell key="concept_coach" {...props} />;
    }
  }
}
