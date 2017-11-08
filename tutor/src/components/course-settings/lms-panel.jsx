import React from 'react';
import { Modal, ToggleButtonGroup, ToggleButton, Button } from 'react-bootstrap';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';

import LoadingScreen from '../loading-screen';
import Course from '../../models/course';
import CopyOnFocusInput from '../copy-on-focus-input';
import Icon from '../icon';


const blackboard = ({ lms }) => (
  <div className="blackboard">
    <a href="http://4tk3oi.axshare.com/salesforce_support_page_results.html" target="_blank">
      <Icon type="info-circle" /> How do I integrate with Blackboard?
    </a>
    <CopyOnFocusInput label="URL" value={lms.launch_url} />
    <CopyOnFocusInput label="Key" value={lms.key} />
    <CopyOnFocusInput label="Secret" value={lms.secret} />
  </div>
);

const canvas = ({ lms }) => (
  <div className="canvas">
    <a href="http://4tk3oi.axshare.com/#g=1&p=salesforce_support_page_results_canvas&c=1" target="_blank">
      <Icon type="info-circle" /> How do I integrate with Canvas?
    </a>
    <CopyOnFocusInput label="Consumer key" value={lms.key} />
    <CopyOnFocusInput label="Shared secret" value={lms.secret} />
    <CopyOnFocusInput label="Configuration URL" value={lms.configuration_url} />
  </div>
);

const moodle = ({ lms }) => (
  <div className="moodle">
    <a href="http://4tk3oi.axshare.com/salesforce_support_page_results.html" target="_blank">
      <Icon type="info-circle" /> How do I integrate with Moodle?
    </a>
    <CopyOnFocusInput label="Secure tool URL" value={lms.launch_url} />
    <CopyOnFocusInput label="Consumer key" value={lms.key} />
    <CopyOnFocusInput label="Shared secret" value={lms.secret} />
  </div>
);

const d2l = ({ lms }) => (
  <div className="d2l">
    <a href="http://4tk3oi.axshare.com/salesforce_support_page_results.html" target="_blank">
      <Icon type="info-circle" /> How do I integrate with Desire2Learn?
    </a>
    <CopyOnFocusInput label="URL" value={lms.launch_url} />
    <CopyOnFocusInput label="Key" value={lms.key} />
    <CopyOnFocusInput label="Secret" value={lms.secret} />
  </div>
);

const sakai = ({ lms }) => (
  <div className="sakai">
    <a href="http://4tk3oi.axshare.com/salesforce_support_page_results.html" target="_blank">
      <Icon type="info-circle" /> How do I integrate with Sakai?
    </a>
    <CopyOnFocusInput label="Launch URL" value={lms.launch_url} />
    <CopyOnFocusInput label="Launch key" value={lms.key} />
    <CopyOnFocusInput label="Launch secret" value={lms.secret} />
  </div>
);

const VENDORS = { blackboard, canvas, moodle, d2l, sakai };

@observer
export default class LMSAccessPanel extends React.PureComponent {

  static propTypes = {
    course: React.PropTypes.instanceOf(Course).isRequired,
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
    if (lms.api.isPending) { return <LoadingScreen />; }
    const VendorPanel = VENDORS[lms.vendor];

    return (
      <div className="lms-access">

        <ToggleButtonGroup
          bsSize="small"
          name="vendor"
          onChange={lms.setVendor}
          value={lms.vendor}
        >
          <ToggleButton value="blackboard">Blackboard</ToggleButton>
          <ToggleButton value="canvas">Canvas</ToggleButton>
          <ToggleButton value="moodle">Moodle</ToggleButton>
          <ToggleButton value="d2l">Desire2Learn</ToggleButton>
          <ToggleButton value="sakai">Sakai</ToggleButton>
        </ToggleButtonGroup>

        <p>
          Copy the information below and paste into your LMS where prompted. Then
          launch OpenStax Tutor from your LMS to pair.
        </p>

        <VendorPanel lms={lms} />

      </div>
    );
  }

  render() {
    const { course } = this.props;

    if (course.canOnlyUseLMS) {
      return this.renderPaired();
    }

    return this.renderKeys();
  }


}
