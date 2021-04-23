import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import createReactClass from 'create-react-class';
import { Dropdown, Container } from 'react-bootstrap';
import Router from '../../helpers/router';
import { sortBy, matches } from 'lodash';
import Name from '../../components/name';
import BindStoreMixin from '../../components/bind-store-mixin';
import Guide from './guide';
import InfoLink from './info-link';
import ColorKey from './color-key';


const Display = createReactClass({
    displayName: 'PerformanceForecastTeacherStudentDisplay',

    mixins: [BindStoreMixin],

    propTypes: {
        course: PropTypes.string.isRequired,
        roleId:   PropTypes.string.isRequired,
        history:  PropTypes.object.isRequired,
    },

    getInitialState() {
        return { roleId: this.props.roleId };
    },

    componentDidMount() {
        this.course.roster.ensureLoaded();
    },

    onSelectStudent(roleId) {
        const { course } = this.props;
        course.performance.studentRoleId = roleId
        this.setState({ roleId });
        return this.props.history.push(
            Router.makePathname('viewPerformanceGuide', { courseId: course.id, roleId })
        );
    },

    renderHeading() {
        const { students } = this.props.course.roster
        const selected = students.find(matches({ role_id: this.state.roleId }));
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
    },

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
    },

    renderEmptyMessage() {
        return (
            <div className="no-data-message">
                No questions have been answered yet.
            </div>
        );
    },

    render() {
        const { course } = this.props;
        const { roleId } = this.state;

        return (
            <Container className="performance-forecast teacher-student">
                <Guide
                    course={course}
                    roleId={roleId}
                    loadingMessage="Loading..."
                    heading={this.renderHeading()}
                    weakerExplanation={this.renderWeakerExplanation()}
                    emptyMessage={this.renderEmptyMessage()}
                    weakerTitle="Their weakest topics"
                    weakerEmptyMessage="Your student hasn't worked enough problems for Tutor to predict their weakest topics."
                />
            </Container>
        );
    },
});

export default withRouter(Display);
