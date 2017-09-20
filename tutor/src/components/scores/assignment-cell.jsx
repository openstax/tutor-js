import React from 'react';

import ReadingCell from './reading-cell';
import HomeworkCell from './homework-cell';
import AbsentCell from './absent-cell';
import ExternalCell from './external-cell';
import ConceptCoachCell from './concept-coach-cell';
import { extend } from 'lodash';

const AssignmentCell = function(props) {
  const student = props.data.students[props.rowIndex];

  props = extend({}, props, {
    student,
    roleId: student.role,
    task: student.data[props.columnIndex],
  });

  switch ((props.task != null ? props.task.type : undefined) || 'null') {
  case 'null': return <AbsentCell key="absent" {...props} />;
  case 'external': return <ExternalCell key="extern" {...props} />;
  case 'reading': return <ReadingCell key="reading" {...props} />;
  case 'homework': return <HomeworkCell key="homework" {...props} />;
  default: return <ConceptCoachCell key="concept_coach" {...props} />;
  }
};


export default AssignmentCell;
