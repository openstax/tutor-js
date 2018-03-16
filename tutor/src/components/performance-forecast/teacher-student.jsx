import React from 'react';
import createReactClass from 'create-react-class';
import { DropdownButton, MenuItem, Panel } from 'react-bootstrap';
import BackButton from '../buttons/back-button';
import Router from '../../helpers/router';
import { sortBy } from 'lodash';
import matches from 'lodash/matches';

import Name from '../name';
import BindStoreMixin from '../bind-store-mixin';
import PerformanceForecast from '../../flux/performance-forecast';

import Courses from '../../models/courses-map';
import Guide from './guide';
import InfoLink from './info-link';
import ColorKey from './color-key';

export default createReactClass({
  displayName: 'PerformanceForecastTeacherStudentDisplay',
  contextTypes: {
    router: React.PropTypes.object
  },

  mixins: [BindStoreMixin],

  propTypes: {
    courseId: React.PropTypes.string.isRequired,
    roleId: React.PropTypes.string.isRequired
  },

  getInitialState() {
    return { roleId: this.props.roleId };
  },

  componentWillMount() {
    Courses.get(this.props.courseId).roster.ensureLoaded();
    return PerformanceForecast.TeacherStudent.actions.load(this.props.courseId, { roleId: this.props.roleId });
  },

  bindStore: PerformanceForecast.TeacherStudent.store,

  onSelectStudent(roleId, ev) {
    const { courseId } = this.props;
    PerformanceForecast.TeacherStudent.actions.load(courseId, { roleId });
    this.setState({ roleId });
    return this.context.router.history.push(Router.makePathname('viewPerformanceGuide', { courseId, roleId }));
  },

  renderHeading() {
    const { students } = Courses.get(this.props.courseId).roster;
    const selected = students.find(matches({ role_id: this.state.roleId }));
    if (!selected) {
      return null;
    }
    const name = <Name {...Object.assign({}, selected)} />;
    return <div className='guide-heading'><div className='guide-group-title'><span className='preamble'>Performance Forecast for:</span><DropdownButton id='student-selection' className='student-selection' title={name} bsStyle='link' onSelect={this.onSelectStudent}>{Array.from(sortBy(students, 'name')).filter(student => student.role_id !== selected.role_id).map(student => <MenuItem key={student.role_id} eventKey={student.role_id}><Name {...Object.assign({}, student)} /></MenuItem>)}</DropdownButton><InfoLink type='teacher_student' /></div><div className='info'><div className='guide-group-key'><ColorKey /></div><BackButton fallbackLink={{ to: 'dashboard', text: 'Back to Dashboard', params: Router.currentParams() }} /></div></div>;
  },

  renderWeakerExplanation() {
    return <div className='explanation'><p>Tutor shows the weakest topics for a student.</p><p>Your help may be needed in these areas.</p></div>;
  },

  renderEmptyMessage() {
    return (<div className="no-data-message">{`\
      No questions have been answered yet.\
    `}</div>);
  },

  render() {
    const { courseId } = this.props;
    const { roleId } = this.state;
    const isLoaded = PerformanceForecast.TeacherStudent.store.isLoaded.bind(PerformanceForecast.TeacherStudent.store, courseId, { roleId });
    const isLoading = PerformanceForecast.TeacherStudent.store.isLoading.bind(PerformanceForecast.TeacherStudent.store, courseId, { roleId });

    return <Panel className='performance-forecast teacher-student'><Guide courseId={courseId} roleId={roleId} isLoaded={isLoaded} isLoading={isLoading} loadingMessage="Loading..." heading={this.renderHeading()} weakerExplanation={this.renderWeakerExplanation()} emptyMessage={this.renderEmptyMessage()} weakerTitle="Their weakest topics" weakerEmptyMessage="Your student hasn't worked enough problems for Tutor to predict their weakest topics." allSections={PerformanceForecast.TeacherStudent.store.getAllSections(courseId, { roleId })} chapters={PerformanceForecast.TeacherStudent.store.getChapters(courseId, { roleId })} /></Panel>;
  }
});
