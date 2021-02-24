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
const DeletePeriodModal = ({ onClose, period, isBusy, onDelete }) => {
    if (!period) {
        return null;
    }
    return (
        <Modal
            show={true}
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
          this <CourseGroupingLabel courseId={period.course.id} /> you
          will no longer have access to work
          done in that <CourseGroupingLabel courseId={period.course.id} /> and
          those students will be removed from the course.
                </p>
                <p>
          Are you sure you want to delete
          this <CourseGroupingLabel courseId={period.course.id} />?
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
};

DeletePeriodModal.propTypes = {
    period: PropTypes.instanceOf(Period),
};

@observer
export default
class DeletePeriodLink extends React.Component {

  static propTypes = {
      period: PropTypes.instanceOf(Period).isRequired,
      onDelete: PropTypes.func.isRequired,
  }

  @observable showModalForPeriod;

  @action.bound close() {
      this.showModalForPeriod = null;
  }

  @action.bound open() {
      this.showModalForPeriod = this.props.period;
  }

  @action.bound performDelete() {
      this.props.onDelete();
      this.props.period.archive().then(this.close);
  }

  render() {
      const { period } = this.props;
      const students = period.course.roster.students.activeByPeriod[period.id];
      if (!isEmpty(students)) { return null; }

      return (
          <React.Fragment>
              <Button
                  onClick={this.open}
                  variant="link"
                  className="control delete-period"
              >
                  <Icon type="trash" />Delete <CourseGroupingLabel courseId={period.course.id} />
              </Button>
              <DeletePeriodModal
                  onClose={this.close}
                  isBusy={this.showModalForPeriod && this.showModalForPeriod.api.isPending}
                  onDelete={this.performDelete}
                  period={this.showModalForPeriod}
              />
          </React.Fragment>
      );
  }
}
