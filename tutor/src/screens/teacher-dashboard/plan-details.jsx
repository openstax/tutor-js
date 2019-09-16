import {
  React, PropTypes, observer, inject,
  computed, observable, action, cn,
} from '../../helpers/react';
import Course from '../../models/course';
import { Modal, Button } from 'react-bootstrap';
import TourContext from '../../models/tour/context';
import TourRegion from '../../components/tours/region';
import Stats from '../../components/plan-stats';
import Event from '../../components/plan-stats/event';
import LmsInfo from '../../components/lms-info-card';
import TutorLink from '../../components/link';
import TeacherTaskPlan from '../../models/task-plans/teacher/plan';
import SupportEmailLink from '../../components/support-email-link';

export default
@inject((allStores, props) => ({
  tourContext: ( props.tourContext || allStores.tourContext ),
}))
@observer
class CoursePlanDetails extends React.Component {

  static defaultProps = {
    hasReview: false,
  }

  static propTypes = {
    hasReview: PropTypes.bool,
    className: PropTypes.string,
    onHide: PropTypes.func.isRequired,
    tourContext: PropTypes.instanceOf(TourContext),
    course: PropTypes.instanceOf(Course).isRequired,
    plan: PropTypes.instanceOf(TeacherTaskPlan).isRequired,
  }

  UNSAFE_componentWillMount() {
    this.props.tourContext.otherModal = this;
  }

  componentWillUnmount() {
    this.props.tourContext.otherModal = null;
  }

  @observable showAssignmentLinks = false;

  @computed get linkParams() {
    const { course, plan } = this.props;
    return { courseId: course.id, id: plan.id, type: plan.type };
  }

  @action.bound onShowAssignmentLinks() {
    this.showAssignmentLinks = true;
  }

  @action.bound onDisplayStats() {
    this.showAssignmentLinks = false;
  }

  @computed get assignmentLinksButton() {
    if (this.props.plan.type === 'event'){ return null; }
    return (
      <Button variant="default" onClick={this.onShowAssignmentLinks}>
        Get assignment link
      </Button>
    );
  }

  @computed get footer() {
    const { plan } = this.props;
    if (this.showAssignmentLinks || !plan.isPublished) { return null; }

    return (
      <div className="modal-footer">

        <TutorLink
          disabled={!plan.isPublished}
          className="btn btn-default"
          to={plan.isExternal ? 'viewScores' : 'reviewTask'}
          params={this.linkParams}
        >
          {plan.isExternal ? 'View Scores' : 'Review Metrics'}
        </TutorLink>

        <TutorLink
          className="btn btn-default"
          to="editAssignment"
          params={this.linkParams}
        >
          {plan.isEditable ? 'Edit' : 'View'}
          {' '}
          {plan.type === 'event' ? 'Event' : 'Assignment'}
        </TutorLink>

        {this.assignmentLinksButton}
      </div>
    );
  }

  @computed get body() {
    const { course, plan } = this.props;
    if (this.showAssignmentLinks) {
      return (
        <LmsInfo
          onBack={this.onDisplayStats}
          plan={plan} courseId={course.id} />
      );
    }

    if (plan.isPublished) {
      if (plan.isEvent) {
        return (
          <Event plan={plan} course={course} />
        );
      } else {
        return (
          <Stats plan={plan} course={course} />
        );
      }
    } else if (plan.isFailed) {
      return (
        <p>
          This assignment failed to publish. Please <SupportEmailLink label="Contact Support" />
        </p>
      );
    } else if (plan.isPublishing) {
      return <p>This assignment is publishing.</p>;
    }
    return null;
  }

  render() {
    const { course, plan: { title, type }, className, onHide } = this.props;

    return (
      <Modal
        onHide={onHide}
        show={true}
        enforceFocus={false}
        data-assignment-type={type}
        className={cn('plan-modal', className)}
      >
        <TourRegion
          id="analytics-modal"
          courseId={course.id}
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
        </TourRegion>
      </Modal>
    );
  }
}
