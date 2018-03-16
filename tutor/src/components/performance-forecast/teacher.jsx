import React from 'react';
import { Panel } from 'react-bootstrap';
import BackButton from '../buttons/back-button';
import Router from '../../helpers/router';
import { first } from 'lodash';

import CoursePeriodsNav from '../course-periods-nav';
import CourseGroupingLabel from '../course-grouping-label';
import PerformanceForecast from '../../flux/performance-forecast';
import TourRegion from '../tours/region';

import Guide from './guide';
import ColorKey from './color-key';
import InfoLink from './info-link';

export default class PerformanceForecastTeacherDisplay extends React.Component {

  static propTypes = {
    courseId: React.PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    const periods = PerformanceForecast.Teacher.store.get(props.courseId);
    this.state = { periodId: __guard__(first(periods), x => x.period_id) };
  }

  selectPeriod = (period) => {
    return this.setState({ periodId: period.id });
  };

  renderHeading = () => {
    const periods = PerformanceForecast.Teacher.store.get(this.props.courseId);
    return <div><div className='guide-heading'><div className='guide-group-title'>{`\
Performance Forecast `}<InfoLink type='teacher' /></div><div className='info'><div className='guide-group-key teacher'><ColorKey /></div><BackButton fallbackLink={{ to: 'dashboard', text: 'Back to Dashboard', params: Router.currentParams() }} /></div></div><CoursePeriodsNav periods={periods} handleSelect={this.selectPeriod} intialActive={this.state.periodId} courseId={this.props.courseId} /></div>;
  };

  renderEmptyMessage = () => {
    return <div className="no-data-message">{`\
There have been no questions worked for
this `}<CourseGroupingLabel courseId={this.props.courseId} lowercase={true} />{`.\
`}</div>;
  };

  renderWeakerExplanation = () => {
    return <div className='explanation'><p>{`\
Tutor shows the weakest topics for
each `}<CourseGroupingLabel courseId={this.props.courseId} lowercase={true} />{`.\
`}</p><p>Students may need your help in those areas.</p></div>;
  };

  render() {
    const { courseId } = this.props;
    return <Panel className='performance-forecast teacher'><TourRegion id="performance-forecast"><Guide courseId={courseId} weakerTitle="Weaker Areas" heading={this.renderHeading()} weakerExplanation={this.renderWeakerExplanation()} weakerEmptyMessage="Your students haven't worked enough problems for Tutor to predict their weakest topics." emptyMessage={this.renderEmptyMessage()} allSections={PerformanceForecast.Teacher.store.getSectionsForPeriod(courseId, this.state.periodId)} chapters={PerformanceForecast.Teacher.store.getChaptersForPeriod(courseId, this.state.periodId)} /></TourRegion></Panel>;
  }
};

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}
