import React from 'react';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import { Button, Modal, PanelGroup, Panel } from 'react-bootstrap';
import Course from '../../models/course';
import Icon from '../icon';
import cn from 'classnames';
import CopyOnFocusInput from '../copy-on-focus-input';
import LMS from './lms-panel';

@observer
export default class StudentAccess extends React.PureComponent {

  static propTypes = {
    course: React.PropTypes.instanceOf(Course).isRequired,
  };

  @observable displayLinksWarning = false;

  renderCheckboxFor(lms) {
    const { course } = this.props;
    if (lms === course.is_lms_enabled) {
      return <Icon type="check" />;
    }
    return null;
  }

  renderDirectHeader() {
    const checked = false === this.props.course.is_lms_enabled;

    return (
      <div className={cn('choice', { checked })}>
        <div
          className="box"
          aria-label={checked ? 'Selected' : ''}
        />
        <div className="heading">
          <p className="title">
            Give students direct links
          </p>
          <p className="info">
            You will give students links to access OpenStax Tutor directly.
          </p>
        </div>
      </div>
    );
  }

  renderLMSHeader() {
    const checked = true === this.props.course.is_lms_enabled;

    return (
      <div className={cn('choice', { checked })}>
        <div
          className="box"
          aria-label={checked ? 'Selected' : ''}
        />
        <div className="heading">
          <p className="title">
            Integrate with your learning management system (LMS)
          </p>
          <p className="info">
            Integrate OpenStax Tutor with Blackboard, Canvas, etc., to send
            student course averages to your LMS and enable single sign on.
          </p>
        </div>
      </div>
    );
  }

  @action.bound onSelectOption(isLMSEnabled, ev, displayLinksWarning = true) {
    const { course } = this.props;
    if (course.is_lms_enabled === isLMSEnabled){ return; }

    if (!isLMSEnabled) {
      this.displayLinksWarning = displayLinksWarning;
      if (this.displayLinksWarning) {
        return;
      }
    }
    course.is_lms_enabled = isLMSEnabled;
    course.save();
  }

  renderDirectLinks() {
    const { course } = this.props;

    return (
      <div className="student-access direct-links-only">
        <p>
          Interested in learning management system (LMS)
          integration? <a target="_blank" className="external-icon" href="https://openstax.secure.force.com/help/articles/How_To/Instructors-integrating-OpenStax-Tutor-with-LMS?search=LMS">
          Find out more.
          </a>
        </p>
        <p>
          If not, send your students their section’s direct links (below) to enroll.
        </p>
        {course.periods.active.map(p => <CopyOnFocusInput key={p.id} label={p.name} value={p.enrollment_url_with_details} />)}
      </div>
    );
  }

  renderLMS() {
    const { course } = this.props;
    return course.is_lms_enabled ? <LMS course={course} /> : null;
  }

  @action.bound onHideLinkSwitch() {
      this.displayLinksWarning = false;
  }

  @action.bound forceLinksSwitch() {
      this.onSelectOption(false, {}, false);
  }

  renderLinkSwitchWarning() {
    return (
      <Modal
        show={this.displayLinksWarning}
        onHide={this.onHideLinkSwitch}
        className="warn-before-links"
      >
        <Modal.Header closeButton={true}>
          <Modal.Title>Direct links instead of LMS integration?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          If you give students direct links, you won't be able to use
          LMS integration features such as single sign on and sending
          course averages to your LMS.  Are you sure you want students
          to enroll using direct links?
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" onClick={this.forceLinksSwitch}>I'm sure</Button>
          <Button onClick={this.onHideLinkSwitch}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  renderPreviewMessage() {
    return <p>Create a live course to view student access options.</p>;
  }

  @computed get isLMS() {
    return this.props.course.is_lms_enabled === true;
  }

  @computed get isLinks() {
    return this.props.course.is_lms_enabled === false;
  }

  render() {
    const { isLMS, isLinks, props: { course } } = this;

    let body = null;
    if (course.is_preview) {
      body = this.renderPreviewMessage();
    } else if (course.canOnlyUseEnrollmentLinks) {
      body = this.renderDirectLinks();
    } else if (course.canOnlyUseLMS) {
      body = <LMS course={course} />;
    }

    if (body) {
      return <div className="student-access">{body}</div>;
    }

    return (
      <div className="student-access">
        {this.renderLinkSwitchWarning()}
        <p>
          Choose how students access OpenStax Tutor.
          Access settings cannot be changed after students begin to enroll.
        </p>
        <a href="https://openstax.secure.force.com/help/articles/FAQ/What-is-the-difference-between-using-a-direct-link-and-using-LMS-integration-to-give-your-students-access-to-OpenStax-Tutor" target="_blank">
          <Icon type="info-circle" /> Which option is right for my course?
        </a>
        <PanelGroup
          accordion
          activeKey={isLMS ? true : isLinks ? false : 'none'}
          onSelect={this.onSelectOption}
        >
          <Panel
            className={cn('links', { active: isLinks })}
            header={this.renderDirectHeader()}
            eventKey={false}
          >
            <p>Send your students their section's direct links to enroll.</p>
            {course.periods.active.map(p => <CopyOnFocusInput key={p.id} label={p.name} value={p.enrollment_url_with_details} />)}
          </Panel>
          <Panel
            className={cn('lms', { active: isLMS })}
            eventKey={true}
            header={this.renderLMSHeader()}
          >
            {this.renderLMS()}
          </Panel>
        </PanelGroup>
      </div>
    );
  }
}
