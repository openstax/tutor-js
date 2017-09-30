import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import LoadingScreen from '../loading-screen';
import Course from '../../models/course';
import CopyOnFocusInput from '../copy-on-focus-input';
import Icon from '../icon';

@observer
export default class LMSAccessPanel extends React.PureComponent {

  static propTypes = {
    course: React.PropTypes.instanceOf(Course).isRequired,
    forceKeys: React.PropTypes.boolean,
  };

  componentWillMount() {
    if (!this.props.course.canOnlyUseEnrollmentLinks) {
      this.props.course.lms.fetch();
    }
  }

  @observable showModal = false;
  @action.bound close() {
    this.showModal = false;
  }

  @action.bound open() {
    this.props.course.lms.fetch();
    this.showModal = true;
  }

  renderPaired() {
    return (
      <div className="lms-access enrolled">
        <p>
          Students enroll in this course and access assignments through a paired course in their LMS.
        </p>
        <a onClick={this.open}>Show LMS keys again</a>
        <Modal
          show={this.showModal}
          onHide={this.close}
          className="lms-pairing-keys"
        >
          <Modal.Header closeButton={true}>
            <Modal.Title>
              LMS Pairing keys
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.renderKeys()}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );

  }

  renderKeys() {
    const { course: { lms } } = this.props;
    if (lms.hasApiRequestPending) { return <LoadingScreen />; }
    return (
      <div className="lms-access">
        <p>
          Copy the information below and paste into your LMS where prompted. Then
          launch OpenStax Tutor from your LMS to pair.
        </p>
        <CopyOnFocusInput label="Secret" value={lms.secret} />
        <CopyOnFocusInput label="Key" value={lms.key} />
        <CopyOnFocusInput label="URL" value={lms.url} />
        <a href="http://4tk3oi.axshare.com/salesforce_support_page_results.html" target="_blank">
          <Icon type="info-circle" /> How do I do this?
        </a>
      </div>
    );
  }

  render() {
    const { course } = this.props;

    if (course.canOnlyUseLMS) {
      return this.renderPaired();
    }
    if (this.props.forceKeys) {
      return this.renderKeys();
    }
    return this.renderPaired();
  }


}
