import React from 'react';
import { observer } from 'mobx-react';
import AnnotationsSummaryToggle from '../../components/annotations/summary-toggle';
import TourRegion from '../../components/tours/region';

const RefBookAnnotationsSummaryToggle = observer(({ ux: { course } }) =>
  <AnnotationsSummaryToggle
    type="refbook"
    courseId={course.id} />
);

export default RefBookAnnotationsSummaryToggle;
