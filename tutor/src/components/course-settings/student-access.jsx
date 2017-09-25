import React from 'react';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import { PanelGroup, Panel } from 'react-bootstrap';
import Course from '../../models/course';
import Icon from '../icon';

import CopyOnFocusInput from '../copy-on-focus-input';

const PeriodLink = ({ period }) => (
  <label className="period">
    {period.name}
    <CopyOnFocusInput value={period.enrollment_url} />
  </label>

);


@observer
export default class StudentAccess extends React.PureComponent {

  static propTypes = {
    course: React.PropTypes.instanceOf(Course).isRequired,
  };

  renderDirectHeader() {
    return (
      <div className="choice">
        <Icon type="square-o" />
        <div className="heading">
          <p className="title">
            Access through direct links
          </p>
          <p>
            Give these links to your students in each section to enroll
          </p>
        </div>
      </div>
    );
  }

  renderLMSHeader() {
    return (
      <div className="choice">
        <Icon type="square-o" />
        <div className="heading">
          <p className="title">
            Access from paired LMS <i className="advanced">Advanced</i>
          </p>
          <p>
            Connect OpenStax Tutor to your learning management system to enable single sign-on
            and course grade sync. Students will use pre-established links in their LMS.
          </p>
        </div>
      </div>
    );
  }

  @action.bound onSelectOption(isEnabled) {
    const { course } = this.props;
    course.is_lms_enabled = isEnabled;
    course.save();
  }

  renderDirectLinks() {
    const { course } = this.props;

    return (
      <div className="direct-links">
        <p>
          Give these links to your students in each section to enroll.
        </p>
        {course.activePeriods.map(p => <PeriodLink period={p}/>)}
      </div>
    );
  }

  render() {
    const { course } = this.props;

    if (course.is_lms_enabling_allowed) {
      return this.renderDirectLinks();
    }

    return (
      <div className="student-access">
        <p>
          Choose how students enroll in and access OpenStax Tutor.
          Access settings cannot be changed once at least one student has enrolled.
        </p>
        <a href="http://4tk3oi.axshare.com/salesforce_support_page_results.html" target="_blank">
          <Icon type="info-circle" /> Which option is right for my course?
        </a>

        <PanelGroup activeKey={course.is_lms_enabled} onSelect={this.onSelectOption} accordion>
          <Panel className="links" header={this.renderDirectHeader()} eventKey={false}>
            {course.activePeriods.map(p => <PeriodLink period={p}/>)}
          </Panel>
          <Panel header={this.renderLMSHeader()} eventKey={true}>
            LMS!
          </Panel>
        </PanelGroup>
      </div>
    );
  }
}
