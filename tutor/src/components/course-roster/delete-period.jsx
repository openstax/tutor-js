import React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { Modal, Button } from 'react-bootstrap';


import { AsyncButton } from 'shared';
import Icon from '../icon';
import Period from '../../models/course/period';
import CourseGroupingLabel from '../course-grouping-label';

const EMPTY_WARNING = 'EMPTY';

const DeletePeriodModal = ({ section, show, onClose, period, isBusy, onDelete }) => (
  <Modal
    show={show}
    onHide={onClose}
    className="settings-delete-period-modal">
    <Modal.Header closeButton={true}>
      <Modal.Title>
        Delete {period.name}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>
        If you delete
        this {section} you
        will no longer have access to work
        done in that section and those students will be removed from the course.
      </p>
      <p>
        Are you sure you want to delete this section?
      </p>
    </Modal.Body>
    <Modal.Footer>
      <AsyncButton
        className="delete"
        bsStyle="danger"
        onClick={onDelete}
        waitingText="Deleting…"
        isWaiting={isBusy}>
        Delete
      </AsyncButton>
      <Button disabled={isBusy} onClick={onClose}>
        Cancel
      </Button>
    </Modal.Footer>
  </Modal>
);

@observer
export default class DeletePeriodLink extends React.PureComponent {

  static propTypes = {
    period: React.PropTypes.instanceOf(Period).isRequired,
    onDelete: React.PropTypes.func.isRequired,
  }

  @observable showModal = false;

  @action.bound close() {
    this.showModal = false;
  }

  @action.bound open() {
    this.showModal = true;
  }

  @action.bound performDelete() {
    this.props.onDelete();
    this.props.period.archive().then(this.close);
  }

  render() {
    const section = <CourseGroupingLabel courseId={this.props.period.course.id} />;
    return (
      <Button
        onClick={this.open}
        bsStyle="link"
        className="control delete-period">
        <DeletePeriodModal
          show={this.showModal}
          period={this.props.period}
          onClose={this.onClose}
          section={section}
          isBusy={this.props.period.hasApiRequestPending}
          onDelete={this.performDelete}
        />
        <Icon type="trash" />Delete {section}
      </Button>
    );
  }
}
