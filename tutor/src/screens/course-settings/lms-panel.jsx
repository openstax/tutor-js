/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import React from 'react';
import { Modal, ToggleButtonGroup, ToggleButton, Button } from 'react-bootstrap';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import Link from '../../components/new-tab-link';
import LoadingScreen from 'shared/components/loading-animation';
import Course from '../../models/course';
import CopyOnFocusInput from '../../components/copy-on-focus-input';
import { Icon } from 'shared';

const blackboard = ({ lms }) => (
    <div className="blackboard">
        <Link href="https://openstax.secure.force.com/help/articles/FAQ/Blackboard-LMS-integration-for-OpenStax-Tutor-Beta">
            <Icon type="info-circle" /> How do I integrate with Blackboard?
        </Link>
        <CopyOnFocusInput label="URL" value={lms.launch_url} />
        <CopyOnFocusInput label="Key" value={lms.key} />
        <CopyOnFocusInput label="Secret" value={lms.secret} />
    </div>
);

const canvas = ({ lms }) => (
    <div className="canvas">
        <Link href="https://openstax.secure.force.com/help/articles/FAQ/Canvas-LMS-integration-for-OpenStax-Tutor-Beta">
            <Icon type="info-circle" /> How do I integrate with Canvas?
        </Link>
        <CopyOnFocusInput label="Consumer key" value={lms.key} />
        <CopyOnFocusInput label="Shared secret" value={lms.secret} />
        <CopyOnFocusInput label="Configuration URL" value={lms.configuration_url} />
    </div>
);

const moodle = ({ lms }) => (
    <div className="moodle">
        <Link href="https://openstax.secure.force.com/help/articles/FAQ/Moodle-LMS-integration-for-OpenStax-Tutor-Beta">
            <Icon type="info-circle" /> How do I integrate with Moodle?
        </Link>
        <CopyOnFocusInput label="Secure tool URL" value={lms.launch_url} />
        <CopyOnFocusInput label="Consumer key" value={lms.key} />
        <CopyOnFocusInput label="Shared secret" value={lms.secret} />
    </div>
);

const d2l = ({ lms }) => (
    <div className="d2l">
        <Link href="https://openstax.secure.force.com/help/articles/FAQ/Desire2Learn-LMS-integration-for-OpenStax-Tutor-Beta">
            <Icon type="info-circle" /> How do I integrate with Desire2Learn?
        </Link>
        <CopyOnFocusInput label="URL" value={lms.launch_url} />
        <CopyOnFocusInput label="Key" value={lms.key} />
        <CopyOnFocusInput label="Secret" value={lms.secret} />
    </div>
);

const sakai = ({ lms }) => (
    <div className="sakai">
        <Link href="https://openstax.secure.force.com/help/articles/FAQ/Sakai-LMS-integration-for-OpenStax-Tutor-Beta">
            <Icon type="info-circle" /> How do I integrate with Sakai?
        </Link>
        <CopyOnFocusInput label="Launch URL" value={lms.launch_url} />
        <CopyOnFocusInput label="Launch key" value={lms.key} />
        <CopyOnFocusInput label="Launch secret" value={lms.secret} />
    </div>
);

const VENDORS = { blackboard, canvas, moodle, d2l, sakai };

@observer
export default
class LMSAccessCard extends React.Component {

  static propTypes = {
      course: PropTypes.instanceOf(Course).isRequired,
  };

  UNSAFE_componentWillMount() {
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
      const VendorCard = VENDORS[lms.vendor];

      return (
          <div className="lms-access">

              <ToggleButtonGroup
                  size="small"
                  name="vendor"
                  onChange={lms.setVendor}
                  value={lms.vendor}
              >
                  <ToggleButton variant="default" value="blackboard">Blackboard</ToggleButton>
                  <ToggleButton variant="default" value="canvas">Canvas</ToggleButton>
                  <ToggleButton variant="default" value="moodle">Moodle</ToggleButton>
                  <ToggleButton variant="default" value="d2l">Desire2Learn</ToggleButton>
                  <ToggleButton variant="default" value="sakai">Sakai</ToggleButton>
              </ToggleButtonGroup>

              <p>
          Copy the information below and paste into your LMS where prompted. Then
          launch OpenStax Tutor from your LMS to pair.
              </p>

              <VendorCard lms={lms} />

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
