import React from 'react';
import { observer } from 'mobx-react';
import AnnotationsSummaryToggle from '../annotations/summary-toggle';
import TourAnchor from '../tours/anchor';

const RefBookAnnotationsSummaryToggle = observer(({ ux: { course } }) =>
  <TourAnchor id="student-highlighting-button">
    <AnnotationsSummaryToggle
      type="refbook"
      courseId={course.id} />
  </TourAnchor>
);

export default RefBookAnnotationsSummaryToggle;
