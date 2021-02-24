import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { isEmpty } from 'lodash';
import { Button, Modal } from 'react-bootstrap';
import { SpyMode, AsyncButton } from 'shared';
import Time from '../../components/time';
import { Icon } from 'shared';
import CourseGroupingLabel from '../../components/course-grouping-label';
import Course from '../../models/course';
import Period from '../../models/course/period';

@observer
class ArchivedPeriodRow extends React.Component {

  static propTypes = {
      period: PropTypes.instanceOf(Period).isRequired,
      onComplete: PropTypes.func.isRequired,
  }

  @action.bound restore() {
      this.props.period.unarchive().then(this.props.onComplete);
  }

  render() {
      const { period } = this.props;

      return (
          <tr>
              <td>
                  {period.name}
              </td>
              <td>
                  <Time date={period.archived_at} />
              </td>
              <td>
                  <span className="control restore-period">
                      <AsyncButton
                          className="unarchive-section"
                          variant="link"
                          onClick={this.restore}
                          isWaiting={period.api.isPending}
                      >
                          <Icon type="recycle" /> Unarchive
                      </AsyncButton>
                  </span>
              </td>
          </tr>
      );
  }
}


@observer
export default
class ViewArchivedPeriods extends React.Component {

  static propTypes = {
      course: PropTypes.instanceOf(Course).isRequired,
      onComplete: PropTypes.func.isRequired,
  }

  @observable showModal = false;

  @action.bound close() {
      this.showModal = false;
  }

  @action.bound open() {
      this.showModal = true;
  }

  render() {

      const { archived } = this.props.course.periods;
      if (isEmpty(archived)) { return null; }

      const section = <CourseGroupingLabel courseId={this.props.course.id} />;

      return (
          <SpyMode.Content unstyled={true} className="view-archived-periods">
              <Button
                  onClick={this.open}
                  variant="link"
                  className="control view-archived-periods"
              >
          View Archived {section}
                  <Modal
                      show={this.showModal}
                      onHide={this.close}
                      className="settings-view-archived-periods-modal">
                      <Modal.Header closeButton={true}>
                          <Modal.Title>
                Archived {section}
                          </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                          <p>
                The table below shows previously
                archived {section} of this course.
                          </p>
                          <p>
                You can "unarchive" a {section} to make it visible again.
                          </p>
                          <table>
                              <thead>
                                  <tr>
                                      <th>
                      Name
                                      </th>
                                      <th colSpan={2}>
                      Archive date
                                      </th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {archived.map((period) =>
                                      <ArchivedPeriodRow key={period.id} onComplete={this.close} period={period} />)}
                              </tbody>
                          </table>
                      </Modal.Body>
                  </Modal>
              </Button>
          </SpyMode.Content>
      );
  }
}
