import React from 'react';
import { Panel } from 'react-bootstrap';
import BackButton from '../buttons/back-button';
import Router from '../../helpers/router';
import _ from 'underscore';

import PerformanceForecast from '../../flux/performance-forecast';

import Guide from './guide';
import ColorKey from './color-key';
import InfoLink from './info-link';

export default class PerformanceForecastStudentDisplay extends React.Component {

  static propTypes = {
    courseId: React.PropTypes.string.isRequired
  };

  renderHeading = () => {
    return <div className='guide-heading'><div className='guide-group-title'>{`\
Performance Forecast `}<InfoLink type='student' /></div><div className='info'><div className='guide-group-key'><div className='guide-practice-message'>{`\
Click on the bar to practice the topic\
`}</div><ColorKey /></div><BackButton fallbackLink={{ to: 'dashboard', text: 'Back to Dashboard', params: Router.currentParams() }} /></div></div>;
  };

  renderEmptyMessage = () => {
    return <div className="no-data-message">You have not worked any questions yet.</div>;
  };

  renderWeakerExplanation = () => {
    return <div className='explanation'><p>Tutor shows your weakest topics so you can practice to improve.</p><p>Try to get all of your topics to green!</p></div>;
  };

  render() {
    const { courseId } = this.props;
    return <Panel className='performance-forecast student'><Guide canPractice={true} courseId={courseId} weakerTitle="My Weaker Areas" weakerExplanation={this.renderWeakerExplanation()} weakerEmptyMessage="You haven't worked enough problems for Tutor to predict your weakest topics." heading={this.renderHeading()} emptyMessage={this.renderEmptyMessage()} allSections={PerformanceForecast.Student.store.getAllSections(courseId)} chapters={PerformanceForecast.Student.store.get(courseId).children} /></Panel>;
  }
};
