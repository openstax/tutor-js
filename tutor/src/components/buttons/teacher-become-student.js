import { React, PropTypes, observer, action, observable, styled, modelize } from 'vendor';
import { FeatureFlags, Course } from '../../models';
import { withRouter } from 'react-router-dom';
import { Button, Dropdown } from 'react-bootstrap';
import { Icon } from 'shared';
import Theme from '../../theme';

const BecomeButton = styled(Button).attrs({
    className: 'd-inline-flex align-items-center',
    variant: 'link',
})`
  &.btn {
    padding: 0;
    border: 0;
    border-bottom-width: 1px;
  }
`;
BecomeButton.displayName = 'BecomeButton';

const Waiting = styled.div`
  color: ${Theme.colors.neutral.bright};
  display: flex;
  align-items: center;
  .ox-icon { width: 2.4rem; }
`;

const PeriodSelector = styled(Dropdown)`
.dropdown-toggle {
  display: flex;
  align-items: center;
  color: white;
  padding: 0;
  border: 0;
  border-bottom-width: 1px;
  &::after {
    display: none;
  }
  &:hover {
    color: ${Theme.colors.neutral.bright};
  }
  .ox-icon { width: 2.4rem; }
  .menu-toggle-icon { margin: 0; }
}
&.show .dropdown-toggle {
  border-bottom-color: transparent;
}
.dropdown-menu {
  width: 100%;
  box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.1);
}
.dropdown-item {
  word-wrap: break-word;
  white-space: normal;
  color: ${Theme.colors.neutral.gray};
}
.dropdown-divider:last-of-type {
  display: none;
}
`;

@withRouter
@observer
export default class TeacherBecomesStudent extends React.Component {
    static propTypes = {
        course: PropTypes.instanceOf(Course),
        history: PropTypes.object.isRequired,
    }

    @observable isCreating = false;
    @observable periodMenuIsOpen = false;

    constructor(props) {
        super(props);
        modelize(this);
    }

    @action.bound onBecomeStudentPeriodSelect(periodId) {
        this.becomeStudentInPeriod(
            this.props.course.periods.find(p => p.id == periodId)
        );
    }

    @action.bound onBecomeStudentClick() {
        this.becomeStudentInPeriod(
            this.props.course.periods.find(period => !period.is_archived)
        );
    }

    async becomeStudentInPeriod(period) {
        const { course } = this.props;
        this.isCreating = true;
        const role = await period.getTeacherStudentRole();
        this.props.history.push(`/course/${course.id}/become/${role.id}`);
    }

    @action.bound onPeriodMenuToggle(isOpen) {
        this.periodMenuIsOpen = isOpen;
    }

    render() {
        const { course } = this.props;

        if (!FeatureFlags.teacher_student_enabled ||
      !course ||
      !course.currentRole.isTeacher
        ) { return null; }

        if (this.isCreating) {
            return (
                <Waiting className="control">
                    <Icon type="spinner" spin size="2x" />
          Generating student view…
                </Waiting>
            );
        }

        if (1 === course.periods.active.length) {
            return (
                <BecomeButton onClick={this.onBecomeStudentClick}>
                    <Icon size="2x" type="glasses" />
          View as student
                </BecomeButton>
            );
        }

        return (
            <PeriodSelector
                onToggle={this.onPeriodMenuToggle}
                onSelect={this.onBecomeStudentPeriodSelect}
            >
                <Dropdown.Toggle variant="link" id="teacher-become-student">
                    <Icon size="2x" type="glasses" />
          View as student
                    <Icon
                        className="menu-toggle-icon"
                        type={this.periodMenuIsOpen ? 'close' : 'angle-down'}
                    />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {course.periods.active.map((period) => (
                        <React.Fragment key={period.id}>
                            <Dropdown.Item eventKey={period.id}>{period.name}</Dropdown.Item>
                            <Dropdown.Divider />
                        </React.Fragment>
                    ))}
                </Dropdown.Menu>
            </PeriodSelector>
        );
    }
}
