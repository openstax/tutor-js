import {
  React, PropTypes, observer, inject,
  computed, observable, action, styled,
} from 'vendor';
import { first } from 'lodash';
import Course from '../../models/course';
import { Modal, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import TourContext from '../../models/tour/context';
import TourRegion from '../../components/tours/region';
import Stats from '../../components/plan-stats';
import Event from '../../components/plan-stats/event';
import LmsInfo from '../../components/lms-info-card';
import TutorLink from '../../components/link';
import TeacherTaskPlan from '../../models/task-plans/teacher/plan';
import SupportEmailLink from '../../components/support-email-link';
import moment from 'moment';
import TemplateModal from '../../components/course-modal';
import cn from 'classnames';

const DateFieldsWrapper = styled.div`
  padding-bottom: 1.25rem;
  margin-top: 4rem;
`;

const StyledTemplateModal = styled(TemplateModal)`
  & .modal-dialog {
    max-width: 72rem;
  }

  h6 {
    font-weight: bold;
  }

  .modal-footer {
    justify-content: flex-start;
  }
`;


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

  async UNSAFE_componentWillMount() {
    this.props.tourContext.otherModal = this;
  }

  componentWillUnmount() {
    this.props.tourContext.otherModal = null; 
  }

  @observable showAssignmentLinks = false;
  @observable selectedPeriodId = this.props.plan.activeAssignedPeriods.length > 0 ? first(this.props.plan.activeAssignedPeriods).id : undefined;

  @computed get linkParams() {
    const { course, plan } = this.props;
    return { courseId: course.id, id: plan.id, type: plan.type, periodId: this.selectedPeriodId };
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
      <button className="btn btn-standard" onClick={this.onShowAssignmentLinks}>
        Get assignment link
      </button>
    );
  }

  @computed get gradeAnswersButton() {
    const { plan, course } = this.props;
    if (!plan.wrq_count) { return null; }


    let disabledToolTipMessage;
    if(!this.tasking.isPastDue) {
      disabledToolTipMessage = 'Assignment will be available for grading after the due date.';
    } else if(!plan.gradable_step_count) {
      disabledToolTipMessage = 'No responses to grade yet.';
    }

    return (
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip>
            {disabledToolTipMessage}
          </Tooltip>
        }
      >
        <span>
          <TutorLink
            className={
              cn(
                'btn btn-standard',
                { 'disabled': !plan.gradable_step_count,
                  'btn-primary': plan.ungraded_step_count,
                }
              )
            }
            to="gradeAssignment"
            data-test-id="gradeAnswers"
            params={{ id: plan.id, periodId: this.tasking.target_id, courseId: course.id }}
          >
            {plan.gradable_step_count && this.tasking.isPastDue ? 'Grade answers' : 'Regrade answers'}
          </TutorLink>
        </span>
      </OverlayTrigger>
    );
  }

  @computed get footer() {
    const { plan } = this.props;
    if (this.showAssignmentLinks || !plan.isPublished) { return null; }

    return (
      <div className="modal-footer">
        <TutorLink
          disabled={!plan.isPublished}
          className="btn btn-standard"
          to={'reviewAssignment'}
          params={this.linkParams}
        >
          View assignment
        </TutorLink>
        {this.assignmentLinksButton}
        {this.gradeAnswersButton}
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
          <Stats plan={plan} course={course} handlePeriodSelect={this.onPeriodSelect} />
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

  @action.bound onPeriodSelect(period) {
    this.selectedPeriodId = period.id;
  }

  @computed get tasking() {
    const periodId = this.selectedPeriodId || this.props.plan.activeAssignedPeriods[0].id;

    return this.props.plan.tasking_plans.find(t =>
      t.target_id == periodId && t.target_type === 'period'
    );
  }

  renderDateFields() {
    const format = 'MMM D hh:mm A';
    const { isEvent } = this.props.plan;
    const mdWidth = isEvent ? 6 : 4;
    return (
      <DateFieldsWrapper>
        <Row className="tasking-date-time">
          <Col xs={12} md={mdWidth} className="opens-at">
            <b>Open date & time</b>
          </Col>
          <Col xs={12} md={mdWidth} className="due-at">
            <b>Due date & time</b>
          </Col>
          {!isEvent && (
            <Col xs={12} md={mdWidth} className="closes-at">
              <b>Close date & time</b>
            </Col>)}
        </Row>
        <Row className="tasking-date-time">
          <Col xs={12} md={mdWidth} className="opens-at">
            {moment(this.tasking.opens_at).format(format)}
          </Col>
          <Col xs={12} md={mdWidth} className="due-at">
            {moment(this.tasking.due_at).format(format)}
          </Col>
          {!isEvent && (
            <Col xs={12} md={mdWidth} className="closes-at">
              {moment(this.tasking.closes_at).format(format)}
            </Col>)}
        </Row>
      </DateFieldsWrapper>
    );
  }

  render() {
    const { course, plan: { title, type }, className, onHide } = this.props;

    return (
      <StyledTemplateModal
        onHide={onHide}
        show={true}
        enforceFocus={false}
        data-assignment-type={type}
        templateType={type}
        className={className}
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
          <Modal.Body>
            {this.body}
            {this.tasking && this.renderDateFields()}
            <hr />
          </Modal.Body>
          {this.footer}
        </TourRegion>
      </StyledTemplateModal>
    );
  }
}
