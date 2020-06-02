import { React, PropTypes, observer, styled } from 'vendor';
import { find, without } from 'lodash';
import { Dropdown } from 'react-bootstrap';
import Course  from '../models/course';
import Period from '../models/course/period';
import { colors } from 'theme';
import CGL from './course-grouping-label';

const Label = styled.label`
  .cgl { margin-right: 1rem; }
`;

const StyledDropdownToggle = styled(Dropdown.Toggle)`
  && {
    border: 1px solid ${colors.forms.borders.light};
    color: ${colors.neutral.dark};
    border-radius: 4px;
    min-width: 18rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

const CoursePeriodSelect = observer(({ course, periods, period, onChange }) => {
  const items = periods || course.periods.active;
  const choices = without(items, period);

  const onSelect = (periodId) => {
    const period = find(items, { id: periodId });
    onChange(period);
  };

  return (
    <Dropdown alignRight onSelect={onSelect}>
      <Label>
        <StyledDropdownToggle id="course-period-select" variant="outline-secondary">
          <span>
            <CGL course={course} />
            {period.name}
          </span>
        </StyledDropdownToggle>
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
