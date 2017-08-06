import React from 'react';
import { Row, Col, Modal, Button } from 'react-bootstrap';
import _ from 'underscore';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { CourseStore, CourseActions } from '../../flux/course';
import { AsyncButton } from 'shared';
import { TutorInput } from '../tutor-input';
import classnames from 'classnames';
import Icon from '../icon';
import Courses from '../../models/courses-map';
import LMS from '../../models/course/lms';
import CopyOnFocusInput from '../copy-on-focus-input';
import Activity from '../ox-fancy-loader';

@observer
class InfoModal extends React.PureComponent {

  static propTypes = {
    courseId: React.PropTypes.string.isRequired,
    onClose:  React.PropTypes.func.isRequired,
  }

  @observable lmsInfo = new LMS(Courses.get(this.props.courseId));

  componentWillMount() {
    this.lmsInfo.fetch();
  }

  render() {
    const { onClose } = this.props;

    return (
      <Modal
        show={true}
        onHide={onClose}
        className="settings-edit-course-modal">
        <Modal.Header closeButton={true}>
          <Modal.Title>
            LMS Connection information
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Activity isLoading={this.lmsInfo.hasApiRequestPending} />
          <Row>
            <Col xs={3}>Launch URL:</Col>
            <Col xs={9}><CopyOnFocusInput value={this.lmsInfo.url} /></Col>
          </Row>
          <Row>
            <Col xs={3}>Key:</Col>
            <Col xs={9}><CopyOnFocusInput value={this.lmsInfo.key} /></Col>
          </Row>
          <Row>
            <Col xs={3}>Secret:</Col>
            <Col xs={9}><CopyOnFocusInput value={this.lmsInfo.secret} /></Col>
          </Row>
        </Modal.Body>
        <div className="modal-footer">
          <Button bsStyle="primary" onClick={onClose}>
            OK
          </Button>
        </div>
      </Modal>
    )
  }
}


@observer
export default class LMSInfo extends React.PureComponent {

  static propTypes = {
    courseId: React.PropTypes.string.isRequired,
  }

  @observable isShowing = false

  @action.bound
  onClose() {
    this.isShowing = false;
  }

  @action.bound
  onOpen() {
    this.isShowing = true;
  }

  render() {
    const { courseId, ...sizes }  = this.props;
    const modal = this.isShowing ? <InfoModal onClose={this.onClose} courseId={courseId} /> : null;

    return (
      <Col className="lms-info" {...sizes} >
        <Button onClick={this.onOpen} bsStyle="link" className="control edit-course">
          <span>LMS Information</span>
          <Icon type="school" />
        </Button>
        {modal}
      </Col>
    );
  }
}
