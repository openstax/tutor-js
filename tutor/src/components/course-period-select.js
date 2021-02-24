import { React, PropTypes, observer, styled, css } from 'vendor';
import { find, without } from 'lodash';
import { Dropdown } from 'react-bootstrap';
import Course  from '../models/course';
import Period from '../models/course/period';
import { colors } from 'theme';
import CGL from './course-grouping-label';

const Label = styled.label`

`;

const selectionStyles = css`
  border: 1px solid ${colors.forms.borders.light};
  color: ${colors.neutral.dark};
  border-radius: 4px;
  min-width: 18rem;
  .cgl { margin-right: 0.5rem; }
`;

const StyledDropdownToggle = styled(Dropdown.Toggle)`
  && {
    ${selectionStyles}
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

const SinglePeriod = styled.div`
  ${selectionStyles}
  font-size: 1.6rem;
  min-height: 3.5rem;
  display: flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
`;

const CoursePeriodSelect = observer(({ course, periods, period, onChange }) => {
    const items = periods || course.periods.active;
    const choices = without(items, period);
    if (!period) { return null; }

    const onSelect = (periodId) => {
        const period = find(items, { id: periodId });
        onChange(period);
    };

    if (0 == choices.length) {
        return (
            <SinglePeriod><CGL course={course} /> {period.name}</SinglePeriod>
        );
    }

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
