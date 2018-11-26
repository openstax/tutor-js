import React from 'react';
import { observer } from 'mobx-react';
import Toggle from '../../components/notes/summary-toggle';

const RefBookNotesSummaryToggle = observer(({ ux: { course } }) =>
  course ? <Toggle type="refbook" courseId={course.id} /> : null
);

export default RefBookNotesSummaryToggle;
