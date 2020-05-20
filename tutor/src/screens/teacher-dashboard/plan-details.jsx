import {
  React, PropTypes, observer, inject,
  computed, observable, action, styled,
} from 'vendor';
import Course from '../../models/course';
import { Modal, Row, Col, Alert, OverlayTrigger, Tooltip } from 'react-bootstrap';
import TourContext from '../../models/tour/context';
import TourRegion from '../../components/tours/region';
import Stats from '../../components/plan-stats';
import Event from '../../components/plan-stats/event';
import LmsInfo from '../../components/lms-info-card';
import TutorLink from '../../components/link';
import TeacherTaskPlan from '../../models/task-plans/teacher/plan';
import SupportEmailLink from '../../components/support-email-link';
import DateTime from '../../components/date-time-input';
import moment from 'moment';
import Time from '../../models/time';
import { Formik } from 'formik';
import TemplateModal from '../../components/template-modal';
import cn from 'classnames';

const StyledAlert = styled(Alert)`
  margin-top: 0.5rem;
  font-size: 1.6rem;
`;

const CantEditExplanation = () => (
  <StyledAlert variant="secondary">
    Cannot be edited after assignment is visible
  </StyledAlert>
);

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

  UNSAFE_componentWillMount() {
    this.props.tourContext.otherModal = this;
  }

  componentWillUnmount() {
    this.props.tourContext.otherModal = null;
  }

  @observable showAssignmentLinks = false;
  @observable selectedPeriodId;

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
      <button className="btn btn-standard" onClick={this.onShowAssignmentLinks}>
        Get assignment link
      </button>
    );
  }

  @computed get gradeAnswersButton() {
    const { plan, course } = this.props;
    if (!plan.canGrade) { return null; }
    return (
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip>
            {!this.tasking.isPastDue && 'Assignment will be available for grading after the due date.'}
          </Tooltip>
        }
      >
        <span>
          <TutorLink
            className={cn('btn btn-standard btn-primary', { 'disabled': !this.tasking.isPastDue }) }
            to="gradeAssignment"
            data-test-id="gradeAnswers"
            params={{ id: plan.id, periodId: this.tasking.target_id, courseId: course.id }}
          >
            Grade answers
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

  @action.bound onOpensChange({ target: { value: date } }, setFieldValue) {
    this.tasking.setOpensDate(date);
    setFieldValue('opens_at', this.tasking.opens_at);
    this.tasking.plan.save();
  }

  @action.bound onDueChange({ target: { value: date } }, setFieldValue) {
    this.tasking.setDueDate(date);
    setFieldValue('due_at', this.tasking.due_at);
    this.tasking.plan.save();
  }

  @action.bound onClosesChange({ target: { value: date } }, setFieldValue) {
    this.tasking.setClosesDate(date);
    setFieldValue('closes_at', this.tasking.closes_at);
    this.tasking.plan.save();
  }

  @computed get tasking() {
    const periodId = this.selectedPeriodId || this.props.course.periods[0].id;

    return this.props.plan.tasking_plans.find(t =>
      t.target_id == periodId && t.target_type === 'period'
    );
  }

  renderDueAtError() {
    if (this.tasking.isValid || !this.tasking.due_at) { return null; }

    let msg = null;
    const due = moment(this.tasking.due_at);
    if (due.isBefore(Time.now)) {
      msg = 'Due time has already passed';
    } else if (due.isBefore(this.tasking.opens_at)) {
      msg = 'Due time cannot come before task opens';
    }
    if (!msg) { return null; }
    return (
      <StyledAlert variant="danger">
        {msg}
      </StyledAlert>
    );
  }

  renderDateFields() {
    const format = 'MMM D hh:mm A';

    return (
      <DateFieldsWrapper>
        <Formik
          enableReinitialize
          initialValues={this.tasking}
        >
          {({ setFieldValue }) => (
            <Row className="tasking-date-time">
              <Col xs={12} md={4} className="opens-at">
                <DateTime
                  label="Open date & time"
                  name="opens_at"
                  onChange={e => this.onOpensChange(e, setFieldValue)}
                  format={format}
                />
                {!this.tasking.canEditOpensAt && <CantEditExplanation />}
              </Col>
              <Col xs={12} md={4} className="due-at">
                <DateTime
                  label="Due date & time"
                  name="due_at"
                  onChange={e => this.onDueChange(e, setFieldValue)}
                  format={format}
                />
                {this.renderDueAtError()}
              </Col>
              <Col xs={12} md={4} className="closes-at">
                <DateTime
                  label="Close date & time"
                  name="closes_at"
                  onChange={e => this.onClosesChange(e, setFieldValue)}
                  format={format}
                />
              </Col>
            </Row>)}
        </Formik>
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
