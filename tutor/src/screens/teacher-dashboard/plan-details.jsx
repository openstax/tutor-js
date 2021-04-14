import {
    React, PropTypes, observer, inject,
    computed, observable, action, styled, cn,
} from 'vendor';
import { first } from 'lodash';
import { Modal, Row, Col, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { Course, TourContext, TeacherTaskPlan } from '../../models'
import TourRegion from '../../components/tours/region';
import Stats from '../../components/plan-stats';
import Event from '../../components/plan-stats/event';
import LmsInfo from '../../components/lms-info-card';
import TutorLink from '../../components/link';
import SupportEmailLink from '../../components/support-email-link';
import BookPartTitle from '../../components/book-part-title';
import TemplateModal from '../../components/course-modal';
import TimeHelper from '../../helpers/time';

const DateFieldsWrapper = styled.div`
  margin-bottom: 2.5rem;
  margin-top: 4rem;
`;

const SectionsAssignedWrapper = styled.div`
  margin-bottom: 2.5rem;
  margin-top: 4.5rem;

  ul {
    padding-inline-start: 15px;
    margin-bottom: 0.5rem;

    .hidden {
      display: none;
    }
  }

  .btn-link {
    margin-left: 5px;
    text-decoration: underline;
    font-weight: 600;
  }
`;

const StyledTemplateModal = styled(TemplateModal)`
  & .modal-dialog {
    max-width: 72rem;
  }

  &&& .modal-body {
    padding: 4rem 4rem 2rem;
  }

  h6 {
    font-weight: bold;
  }

  .modal-footer {
    justify-content: flex-start;
  }
`;


@inject((allStores, props) => ({
    tourContext: ( props.tourContext || allStores.tourContext ),
}))
@observer
export default
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
    @observable showMoreSections = false;
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

        let buttonLabel;
        if(!this.tasking.isPastDue) {
            buttonLabel = 'Grade answers';
        }
        else {
            if(plan.ungraded_step_count == 0) {
                buttonLabel = 'Regrade answers';
            }
            else {
                buttonLabel = 'Grade answers';
            }
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
                                { 'disabled': !plan.gradable_step_count || !this.tasking.isPastDue,
                                    'btn-primary': plan.ungraded_step_count,
                                }
                            )
                        }
                        to="gradeAssignment"
                        data-test-id="gradeAnswers"
                        params={{ id: plan.id, periodId: this.tasking.target_id, courseId: course.id }}
                    >
                        {buttonLabel}
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
        const { isEvent } = this.props.plan;
        const { course } = this.props;
        const format = TimeHelper.HUMAN_DATE_TIME_TZ_FORMAT;
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
                        {course.momentInZone(this.tasking.opens_at).format(format)}
                    </Col>
                    <Col xs={12} md={mdWidth} className="due-at">
                        {course.momentInZone(this.tasking.due_at).format(format)}
                    </Col>
                    {!isEvent && (
                        <Col xs={12} md={mdWidth} className="closes-at">
                            {course.momentInZone(this.tasking.closes_at).format(format)}
                        </Col>)}
                </Row>
            </DateFieldsWrapper>
        );
    }

    // Render the assigned sections.
    // Show only the first two with a button to show the rest of the sections.
    renderAssignedSections() {
        const { plan: { assignedSections } } = this.props;

        if(!assignedSections) return null;
        return (
            <SectionsAssignedWrapper>
                <h6>Sections Assigned</h6>
                {assignedSections.map((section, i) => 
                    <ul key={section.pathId}>
                        <li className={cn({ 'hidden': i >= 2 && !this.showMoreSections })}><BookPartTitle part={section} displayChapterSection /></li>
                    </ul>
                )}
                <Button variant="link" onClick={() => this.showMoreSections = !this.showMoreSections}>{this.showMoreSections ? 'See fewer sections' : `+${assignedSections.length - 2} more sections`}</Button>
            </SectionsAssignedWrapper>
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
                        {(type === 'homework' || type === 'reading') && this.renderAssignedSections()}
                        <hr />
                    </Modal.Body>
                    {this.footer}
                </TourRegion>
            </StyledTemplateModal>
        );
    }
}
