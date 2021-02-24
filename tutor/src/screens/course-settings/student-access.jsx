import PropTypes from 'prop-types';
import React from 'react';
import { partial } from 'lodash';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import { Button, Modal, Card } from 'react-bootstrap';
import Course from '../../models/course';
import { Icon } from 'shared';
import cn from 'classnames';
import CopyOnFocusInput from '../../components/copy-on-focus-input';
import LMS from './lms-panel';
import Theme from '../../theme';

const SelectedIcon = ({ checked }) => (
    <Icon
        type={checked ? 'check-square' : 'square' }
        color={Theme.colors.controls[checked ? 'selected' : 'muted']}
    />
);
SelectedIcon.propTypes = {
    checked: PropTypes.bool,
}

@observer
export default
class StudentAccess extends React.Component {
  static propTypes = {
      course: PropTypes.instanceOf(Course).isRequired,
  };

  @observable displayLinksWarning = false;

  @action.bound onSelectOption(type, displayLinksWarning = true) {
      const isLMSEnabled = (type === 'lms');
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

  renderDirectHeader() {
      const checked = false === this.props.course.is_lms_enabled;

      return (
          <div role="button"
              aria-selected={checked}
              className={cn('links', 'choice', { checked })}
              onClick={partial(this.onSelectOption, 'links')}
          >
              <div className="heading">
                  <h3 className="title">
                      <SelectedIcon checked={checked} />
            Give students direct links
                  </h3>
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
          <div role="button"
              aria-selected={checked}
              className={cn('lms', 'choice', { checked })}
              onClick={partial(this.onSelectOption, 'lms')}
          >
              <div className="heading">
                  <h3 className="title">
                      <SelectedIcon checked={checked} />
            Integrate with your learning management system (LMS)
                  </h3>
                  <p className="info">
            Integrate OpenStax Tutor with Blackboard, Canvas, etc., to send
            student course averages to your LMS and enable single sign on.
                  </p>
              </div>
          </div>
      );
  }

  renderDirectLinks() {
      const { course } = this.props;

      return (
          <div className="student-access direct-links-only">
              <p>
          Interested in learning management system (LMS)
          integration? <a target="_blank" className="external-icon" href="https://openstax.secure.force.com/help/articles/FAQ/LMS-integration-for-OpenStax-Tutor-Beta">
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
      this.onSelectOption('links', false);
  }

  renderLinkSwitchWarning() {
      return (
          <Modal
              show={!!this.displayLinksWarning}
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
                  <Button variant="primary" onClick={this.forceLinksSwitch}>I'm sure</Button>
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
              <a href="https://openstax.secure.force.com/help/articles/FAQ/Student-Access-with-Enrollment-Link-versus-LMS-sign-in-for-OpenStax-Tutor-Beta-LMS-Pilots" target="_blank">
                  <Icon type="info-circle" /> Which option is right for my course?
              </a>
              <div
              >
                  <Card
                      className={cn('links', { active: isLinks })}
                  >
                      <Card.Header>
                          {this.renderDirectHeader()}
                      </Card.Header>
                      <Card.Body>
                          <p>Send your students their section's direct links to enroll.</p>
                          {course.periods.active.map(p => <CopyOnFocusInput key={p.id} label={p.name} value={p.enrollment_url_with_details} />)}
                      </Card.Body>
                  </Card>

                  <Card
                      className={cn('lms', { active: isLMS })}
                  >
                      <Card.Header>
                          {this.renderLMSHeader()}
                      </Card.Header>
                      <Card.Body>
                          {this.renderLMS()}
                      </Card.Body>
                  </Card>
              </div>
          </div>
      );
  }
}
