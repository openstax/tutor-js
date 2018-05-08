import React from 'react';
import { observer } from 'mobx-react';
import Toggle from '../../components/annotations/summary-toggle';

const RefBookAnnotationsSummaryToggle = observer(({ ux: { course } }) =>
  course ? <Toggle type="refbook" courseId={course.id} /> : null
);

export default RefBookAnnotationsSummaryToggle;
