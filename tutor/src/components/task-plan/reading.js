import PropTypes from 'prop-types';
import React from 'react';
import { map, pick } from 'lodash';
import createReactClass from 'create-react-class';
import { Button, Card, Col, Row, Container } from 'react-bootstrap';
import classnames from 'classnames';
import { TaskPlanStore, TaskPlanActions } from '../../flux/task-plan';
import SelectTopics from './select-topics';
import PlanFooter from './footer';
import Page from '../../models/reference-book/page';
import ChapterSection from './chapter-section';
import PlanMixin from './plan-mixin';
import TaskPlanBuilder from './builder';
import NoQuestionsTooltip from './reading/no-questions-tooltip';
import Fn from '../../helpers/function';
import { Icon } from 'shared';
import Courses from '../../models/courses-map';
import TourRegion from '../tours/region';

class ReviewReading extends React.Component {

  static propTypes = {
    page: PropTypes.instanceOf(Page).isRequired,
    index: PropTypes.number.isRequired,
    planId: PropTypes.string.isRequired,
    topicId: PropTypes.string.isRequired,
    canEdit: PropTypes.bool,
  };

  getActionButtons = () => {
    let moveUpButton;
    if (this.props.index) {
      moveUpButton = (
        <Icon onClick={this.moveReadingUp} size="xs" type="arrow-up" />
      );
    }

    if (this.props.canEdit) {
      return (
        <span className="section-buttons">
          {moveUpButton}
          <Icon onClick={this.moveReadingDown} size="xs" type="arrow-down" />
          <Icon onClick={this.removeTopic} type="times" />
        </span>
      );
    }
  };

  moveReadingDown = () => {
    return TaskPlanActions.moveReading(this.props.planId, this.props.topicId, 1);
  };

  moveReadingUp = () => {
    return TaskPlanActions.moveReading(this.props.planId, this.props.topicId, -1);
  };

  removeTopic = () => {
    return TaskPlanActions.removeTopic(this.props.planId, this.props.topicId);
  };

  render() {
    const { page } = this.props;
    if (!page) { return null; }

    const actionButtons = this.getActionButtons();
    return (
      <li className="selected-section">
        <ChapterSection section={page.chapter_section.asString} />
        <span className="section-title">
          {page.title}
        </span>
        {actionButtons}
      </li>
    );
  }
}

class ReviewReadings extends React.Component {

  static propTypes = {
    courseId: PropTypes.string.isRequired,
    planId: PropTypes.string.isRequired,
    selected: PropTypes.array,
    canEdit: PropTypes.bool,
  };

  UNSAFE_componentWillMount() {
    this.book = Courses.get(this.props.courseId).referenceBook;
    return this.book.ensureLoaded();
  }

  renderSection = (topicId, index) => {
    return (
      <ReviewReading
        topicId={topicId}
        page={this.book.pages.byId.get(topicId)}
        planId={this.props.planId}
        canEdit={this.props.canEdit}
        index={index}
        key={`review-reading-${index}`} />
    );
  };

  render() {
    if (this.book.api.isPending) { return null; } // no loading indicator

    if (this.props.selected.length) {
      return (
        <TourRegion
          tag="ul"
          delay={4000}
          className="selected-reading-list"
          id="add-reading-review-sections"
          courseId={this.props.courseId}>
          <li>
            Currently selected
          </li>
          {map(this.props.selected, this.renderSection)}
        </TourRegion>
      );
    } else {
      return <div className="-selected-reading-list-none" />;
    }
  }
}

class ChooseReadings extends React.Component {
  hide = () => {
    const book = Courses.get(this.props.courseId).referenceBook;
    TaskPlanActions.sortTopics(this.props.planId, book.topicInfo);
    return this.props.hide();
  };

  render() {
    const buttonStyle = 'primary';

    const primary =
      <Button
        key="show-problems-btn"
        className="show-problems"
        variant={buttonStyle}
        disabled={(this.props.selected != null ? this.props.selected.length : undefined) === 0}
        onClick={this.hide}>
        {'Add Readings\
  '}
      </Button>;

    return (
      <SelectTopics
        primary={primary}
        onSectionChange={Fn.empty}
        header="Select Readings"
        type="reading"
        course={Courses.get(this.props.courseId)}
        ecosystemId={this.props.ecosystemId}
        planId={this.props.planId}
        selected={this.props.selected}
        cancel={this.props.cancel}
        hide={this.hide} />
    );
  }
}

const ReadingPlan = createReactClass({
  displayName: 'ReadingPlan',
  mixins: [PlanMixin],

  getInitialState() {
    return { showSectionTopics: false };
  },

  render() {
    let addReadingsButton, readingsRequired, selectReadings;
    const { id, courseId } = this.props;
    const builderProps = pick(this.state, 'isVisibleToStudents', 'isEditable', 'isSwitchable');
    const hasError = this.hasError();

    const plan = TaskPlanStore.get(id);
    const ecosystemId = TaskPlanStore.getEcosystemId(id, courseId);

    const topics = TaskPlanStore.getTopics(id);

    const addReadingText = (topics != null ? topics.length : undefined) ? 'Add More Readings' : 'Add Readings';

    if (this.state.showSectionTopics) {
      selectReadings = (
        <ChooseReadings
          hide={this.hideSectionTopics}
          cancel={this.cancelSelection}
          courseId={courseId}
          planId={id}
          ecosystemId={ecosystemId}
          selected={topics}
        />
      );
    }

    const formClasses = classnames(
      'edit-reading',
      'dialog',
      {
        'hide': this.state.showSectionTopics,
        'is-invalid-form': hasError,
      },
    );

    if (!this.state.isVisibleToStudents) {
      addReadingsButton = (
        <Button
          id="reading-select"
          className={classnames('-select-sections-btn', {
            'invalid': hasError && !(topics != null ? topics.length : undefined)
          })}
          onClick={this.showSectionTopics}
          variant="default"
        >
          {'+ '}
          {addReadingText}
        </Button>
      );
    }

    if (hasError && !(topics != null ? topics.length : undefined)) {
      readingsRequired = (
        <span className="readings-required">
          Please add readings to this assignment.
        </span>
      );
    }

    return (
      <div className="reading-plan task-plan" data-assignment-type="reading">
        <Card className={formClasses}>
          <Card.Header>
            {this.builderHeader('reading')}
          </Card.Header>
          {!this.state.showSectionTopics && (
            <Card.Body>
              <TaskPlanBuilder
                id={id}
                courseId={courseId}
                {...builderProps}
              />
              <Row>
                <Col xs={12} md={12}>
                  <ReviewReadings
                    canEdit={!this.state.isVisibleToStudents}
                    courseId={courseId}
                    planId={id}
                    ecosystemId={ecosystemId}
                    selected={topics}
                  />
                  {addReadingsButton}
                  <NoQuestionsTooltip />
                  {readingsRequired}
                </Col>
              </Row>
            </Card.Body>
          )}
          <PlanFooter
            id={id}
            courseId={courseId}
            onPublish={this.publish}
            onSave={this.save}
            onCancel={this.cancel}
            hasError={hasError}
            isVisibleToStudents={this.state.isVisibleToStudents}
            getBackToCalendarParams={this.getBackToCalendarParams}
            goBackToCalendar={this.goBackToCalendar}
          />
        </Card>
        {selectReadings}
      </div>
    );
  },
});

export { ReadingPlan };
