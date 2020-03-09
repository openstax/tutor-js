import { React, PropTypes, observer, styled } from 'vendor';
import { find, without } from 'lodash';
import { Dropdown } from 'react-bootstrap';
import Course  from '../models/course';
import Period from '../models/course/period';
import CGL from './course-grouping-label';

const Label = styled.label`
  .cgl { margin-right: 1rem; }
`;

const CoursePeriodSelect = observer(({ course, period, onChange }) => {
  const choices = without(course.periods.active, period);

  const onSelect = (periodId) => {
    const period = find(course.periods, { id: periodId });
    onChange(period);
  };

  return (
    <Dropdown alignRight onSelect={onSelect}>
      <Label>
        <CGL course={course} />
        <Dropdown.Toggle variant="success" id="course-period-select">
          {period.name}
        </Dropdown.Toggle>
      </Label>
      <Dropdown.Menu>
        {choices.map(p => <Dropdown.Item eventKey={p.id} key={p.id}>{p.name}</Dropdown.Item>)}
      </Dropdown.Menu>
    </Dropdown>
  );
});
CoursePeriodSelect.displayName = 'CoursePeriodSelect';
CoursePeriodSelect.propTypes = {
  course: PropTypes.instanceOf(Course),
  period: PropTypes.instanceOf(Period),
  onChange: PropTypes.func.isRequired,
};

export default CoursePeriodSelect;
