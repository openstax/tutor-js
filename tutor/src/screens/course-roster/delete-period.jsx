import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { isEmpty } from 'lodash';
import { Modal, Button } from 'react-bootstrap';
import { AsyncButton } from 'shared';
import { Icon } from 'shared';
import Period from '../../models/course/period';
import CourseGroupingLabel from '../../components/course-grouping-label';

const EMPTY_WARNING = 'EMPTY';

// eslint-disable-next-line react/prop-types
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
        variant="danger"
        onClick={onDelete}
        waitingText="Deleting…"
        isWaiting={isBusy}>
        Delete
      </AsyncButton>
      <Button disabled={isBusy} onClick={onClose} variant="default">
        Cancel
      </Button>
    </Modal.Footer>
  </Modal>
);

export default
@observer
class DeletePeriodLink extends React.Component {

  static propTypes = {
    period: PropTypes.instanceOf(Period).isRequired,
    onDelete: PropTypes.func.isRequired,
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
    const { period } = this.props;
    const students = period.course.roster.students.activeByPeriod[period.id];
    if (!isEmpty(students)) { return null; }

    const section = <CourseGroupingLabel courseId={period.course.id} />;

    return (
      <React.Fragment>
        <Button
          onClick={this.open}
          variant="link"
          className="control delete-period"
        >
          <Icon type="trash" />Delete {section}
        </Button>
        <DeletePeriodModal
          show={this.showModal}
          period={period}
          onClose={this.close}
          section={section}
          isBusy={period.api.isPending}
          onDelete={this.performDelete}
        />
      </React.Fragment>
    );
  }
}
