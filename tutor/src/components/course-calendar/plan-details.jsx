import React from 'react';
import camelCase from 'lodash/camelCase';
import classnames from 'classnames';
import { Modal } from 'react-bootstrap';
import { computed, observable } from 'mobx';

import { StatsModalShell } from '../plan-stats';
import { EventModalShell } from '../plan-stats/event';
import { TaskPlanStore } from '../../flux/task-plan';
import LmsInfo from '../task-plan/lms-info';
import TutorLink from '../link';


class CoursePlanDetails extends React.PureComponent {

  static defaultProps = {
    hasReview: false,
  }

  static propTypes = {
    plan: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      title: React.PropTypes.string.isRequired,
      type: React.PropTypes.string.isRequired,
    }).isRequired,
    courseId: React.PropTypes.string.isRequired,
    onHide: React.PropTypes.func.isRequired,
    hasReview: React.PropTypes.bool,
    isPublishing: React.PropTypes.bool,
    isPublished: React.PropTypes.bool,
    className: React.PropTypes.string,
  }

  @observable keepVisible = false;

  componentWillReceiveProps() {
    // Sometimes, this plan modal will be asked to update while it's opened.
    // i.e. when a plan is mid-publish on open, but completes publishing
    // while the modal is open.
    // In that case, make sure the modal remains open while it's content
    // is updating.
    this.keepVisible = true;
  }

  renderReviewButton() {
    if (!this.props.hasReview) { return null; }
    const { type } = this.props.plan;

    if (type === 'external') {
      return (
        <TutorLink
          className='btn btn-default -view-scores'
          to='viewScores'
          params={this.linkParams}>
          View Scores
        </TutorLink>
      );
    }

    return (
      <TutorLink
        className='btn btn-default'
        to='reviewTask'
        params={this.linkParams}>
        Review Metrics
      </TutorLink>
    );
  }


  @computed get linkParams() {
    return { courseId: this.props.courseId, id: this.props.plan.id };
  }

  @computed get footer() {
    if (! this.props.isPublished) { return null; }
    const editLinkName = camelCase(`edit-${this.props.plan.type}`);

    return (
      <div className="modal-footer">
        <div className="left-buttons">
          {this.renderReviewButton()}
          <TutorLink
            className="btn btn-default -edit-assignment"
            to={editLinkName}
            params={this.linkParams}
          >
            {TaskPlanStore.isEditable(this.props.plan.id) ? 'Edit' : 'View'}
            {' '}
            {this.props.plan.type === 'event' ? 'Event' : 'Assignment'}
          </TutorLink>
        </div>
        <LmsInfo plan={this.props.plan} courseId={this.props.courseId} />
      </div>
    );
  }

  @computed get body() {
    const { courseId, plan: { type, id } } = this.props;
    if (this.props.isPublished) {
      if (type === 'event') {
        return (
          <EventModalShell id={id} courseId={courseId} />
        );
      } else {
        return (
          <StatsModalShell id={id} courseId={courseId} />
        );
      }
    } else if (this.props.isPublishing) {
      return (
        <p>
          This plan is publishing.
        </p>
      );
    }
    return null;
  }

  render() {
    const { plan: { title, type }, className, onHide, isPublishing, isPublished } = this.props;
    if (!isPublishing && !isPublished) { return null; }

    return (
      <Modal
        onHide={onHide}
        show={true}
        data-assignment-type={type}
        className={classnames('plan-modal', className, { 'in': this.keepVisible })}
      >
        <Modal.Header closeButton={true}>
          <Modal.Title>
            {title}
          </Modal.Title>
        </Modal.Header>
        <div className="modal-body">
          {this.body}
        </div>
        {this.footer}
      </Modal>
    );
  }
}


export default CoursePlanDetails;
