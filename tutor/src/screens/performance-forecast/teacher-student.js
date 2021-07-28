import { React, PropTypes, withRouter, action, observer, modelize } from 'vendor';
import { Dropdown, Container } from 'react-bootstrap';
import Router from '../../helpers/router';
import { sortBy } from 'lodash';
import Name from '../../components/name';
import Guide from './guide';
import InfoLink from './info-link';
import ColorKey from './color-key';

@observer
class Display extends React.Component {
    displayName = 'PerformanceForecastTeacherStudentDisplay'

    static propTypes = {
        course: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        history:  PropTypes.object.isRequired,
    }


    constructor(props) {
        super(props)
        this.state = { ...props.match.params }
        modelize(this)
    }

    componentDidMount() {
        this.props.course.roster.ensureLoaded();
    }

    @action.bound onSelectStudent(roleId) {
        const { course } = this.props;
        course.performance.studentRoleId = roleId
        this.setState({ roleId });
        this.props.history.push(
            Router.makePathname('viewPerformanceGuide', { courseId: course.id, roleId })
        );
        course.performance.fetch()
    }

    renderHeading() {
        const { students } = this.props.course.roster
        const selected = students.find(s => s.role_id == this.state.roleId)
        if (!selected) { return null; }

        return (
            <div className="guide-heading">
                <div className="teacher-student-page-heading guide-group-title">
                    <span className="preamble">
                        Performance Forecast for:
                    </span>
                    <Dropdown
                        alignRight
                        onSelect={this.onSelectStudent}
                    >
                        <Dropdown.Toggle
                            id="student-selection"
                            className="student-selection"
                            variant="link"
                        >
                            <Name {...selected} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {sortBy(students, 'name').filter((student) => student.role_id !== selected.role_id && student.is_active).map((student) =>
                                <Dropdown.Item key={student.role_id} eventKey={student.role_id}>
                                    <Name {...student} />
                                </Dropdown.Item>)}
                        </Dropdown.Menu>
                        <InfoLink type="teacher_student" />
                    </Dropdown>
                </div>
                <div className="info">
                    <div className="guide-group-key">
                        <ColorKey />
                    </div>
                </div>
            </div>
        );
    }

    renderWeakerExplanation() {
        return (
            <div className="explanation">
                <p>
                    Tutor shows the weakest topics for a student.
                </p>
                <p>
                    Your help may be needed in these areas.
                </p>
            </div>
        );
    }

    renderEmptyMessage() {
        return (
            <div className="no-data-message">
                No questions have been answered yet.
            </div>
        );
    }

    render() {
        const { course } = this.props;
        const { roleId } = this.state;
        const performance = course.performance.periods[0]

        return (
            <Container className="performance-forecast teacher-student">
                <Guide
                    course={course}
                    roleId={roleId}
                    performance={performance}
                    loadingMessage="Loading..."
                    heading={this.renderHeading()}
                    weakerExplanation={this.renderWeakerExplanation()}
                    emptyMessage={this.renderEmptyMessage()}
                    weakerTitle="Their weakest topics"
                    weakerEmptyMessage="Your student hasn't worked enough problems for Tutor to predict their weakest topics."
                />
            </Container>
        );
    }
}

export default withRouter(Display);
