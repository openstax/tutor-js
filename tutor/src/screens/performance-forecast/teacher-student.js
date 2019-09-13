import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import createReactClass from 'create-react-class';
import { Dropdown, Container } from 'react-bootstrap';
import BackButton from '../../components/buttons/back-button';
import Router from '../../helpers/router';
import { sortBy, matches } from 'lodash';
import Name from '../../components/name';
import BindStoreMixin from '../../components/bind-store-mixin';
import * as PerformanceForecast from '../../flux/performance-forecast';

import Courses from '../../models/courses-map';
import Guide from './guide';
import InfoLink from './info-link';
import ColorKey from './color-key';


const Display = createReactClass({
  displayName: 'PerformanceForecastTeacherStudentDisplay',

  mixins: [BindStoreMixin],

  propTypes: {
    courseId: PropTypes.string.isRequired,
    roleId:   PropTypes.string.isRequired,
    history:  PropTypes.object.isRequired,
  },

  getInitialState() {
    return { roleId: this.props.roleId };
  },

  UNSAFE_componentWillMount() {
    Courses.get(this.props.courseId).roster.ensureLoaded();
    return PerformanceForecast.TeacherStudent.actions.load(this.props.courseId, { roleId: this.props.roleId });
  },

  bindStore: PerformanceForecast.TeacherStudent.store,

  onSelectStudent(roleId) {
    const { courseId } = this.props;
    PerformanceForecast.TeacherStudent.actions.load(courseId, { roleId });
    this.setState({ roleId });
    return this.props.history.push(
      Router.makePathname('viewPerformanceGuide', { courseId, roleId })
    );
  },

  renderHeading() {
    const { students } = Courses.get(this.props.courseId).roster;
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
          <BackButton
            fallbackLink={{ to: 'dashboard', text: 'Back to Dashboard', params: Router.currentParams() }} />
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
        {'\
    No questions have been answered yet.\
    '}
      </div>
    );
  },

  render() {
    const { courseId } = this.props;
    const { roleId } = this.state;
    const isLoaded = PerformanceForecast.TeacherStudent.store.isLoaded.bind(PerformanceForecast.TeacherStudent.store, courseId, { roleId });
    const isLoading = PerformanceForecast.TeacherStudent.store.isLoading.bind(PerformanceForecast.TeacherStudent.store, courseId, { roleId });

    return (
      <Container className="performance-forecast teacher-student">
        <Guide
          courseId={courseId}
          roleId={roleId}
          isLoaded={isLoaded}
          isLoading={isLoading}
          loadingMessage="Loading..."
          heading={this.renderHeading()}
          weakerExplanation={this.renderWeakerExplanation()}
          emptyMessage={this.renderEmptyMessage()}
          weakerTitle="Their weakest topics"
          weakerEmptyMessage="Your student hasn't worked enough problems for Tutor to predict their weakest topics."
          allSections={PerformanceForecast.TeacherStudent.store.getAllSections(courseId, { roleId })}
          chapters={PerformanceForecast.TeacherStudent.store.getChapters(courseId, { roleId })} />
      </Container>
    );
  },
});

export default withRouter(Display);
