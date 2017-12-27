import React from 'react';
import { observer } from 'mobx-react';
import AnnotationsSummaryToggle from '../annotations/summary-toggle';

const RefBookAnnotationsSummaryToggle = observer(({ ux: { course } }) =>
  <AnnotationsSummaryToggle
    type="refbook"
    courseId={course.id} />
);

export default RefBookAnnotationsSummaryToggle;
