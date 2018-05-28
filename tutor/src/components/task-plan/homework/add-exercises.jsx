import React from 'react';
import { keys, isEmpty } from 'lodash';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import { ArrayOrMobxType } from 'shared/helpers/react';
import Loading from '../../loading-screen';
import { PinnedHeaderFooterCard } from 'shared';
import { TaskPlanStore, TaskPlanActions } from '../../../flux/task-plan';
import ExerciseHelpers from '../../../helpers/exercise';
import ExerciseControls from './exercise-controls';
import ExerciseDetails from '../../exercises/details';
import ExerciseCards from '../../exercises/cards';
import TourRegion from '../../tours/region';
import Course from '../../../models/course';
import ScrollTo from '../../../helpers/scroll-to';
import sharedExercises, { ExercisesMap } from '../../../models/exercises';

@observer
class AddExercises extends React.Component {
  static propTypes = {
    course:     React.PropTypes.instanceOf(Course).isRequired,
    exercises:  React.PropTypes.instanceOf(ExercisesMap),
    planId:     React.PropTypes.string.isRequired,
    onAddClick: React.PropTypes.func.isRequired,
    pageIds:    ArrayOrMobxType.isRequired,

  };

  static defaultProps = {
    exercises: sharedExercises,
  };

  componentWillMount() {

    this.props.pageIds.forEach(pg => {
      this.props.exercises.forPageId(pg).forEach(
        e => e.isSelected = TaskPlanStore.hasExercise(this.props.planId, e.id),
      );
    });
  }

  scroller = new ScrollTo();
  @observable currentView = 'cards';
  @observable currentSection;
  @observable displayFeedback;
  @observable focusedExercise;

  @action.bound onShowDetailsViewClick() {
    this.currentView = 'details';
  }

  @action.bound onShowCardViewClick(ev, exercise) {
    this.currentView = 'cards';
    this.focusedExercise = exercise;
  }

  @action.bound onExerciseToggle(ev, exercise) {
    const ex = exercise.wrapper;
    ex.isSelected = !ex.isSelected;
    if (ex.isSelected) {
      TaskPlanActions.addExercise(this.props.planId, ex.id);
    } else {
      TaskPlanActions.removeExercise(this.props.planId, ex.id);
    }

  }

  getExerciseActions = (exercise) => {
    const actions = {};
    if (exercise.isSelected) {
      actions.exclude = {
        message: 'Remove question',
        handler: this.onExerciseToggle,
      };
    } else {
      actions.include = {
        message: 'Add question',
        handler: this.onExerciseToggle,
      };
    }
    if (this.currentView === 'details') {
      this.addDetailsActions(actions, exercise);
    } else {
      this.addCardActions(actions, exercise);
    }
    return actions;
  };

  addDetailsActions = (actions, exercise) => {
    if (this.displayFeedback) {
      actions['feedback-off'] = {
        message: 'Hide Feedback',
        handler: this.toggleFeedback,
      };
    } else {
      actions['feedback-on'] = {
        message: 'Preview Feedback',
        handler: this.toggleFeedback,
      };
    }
    return (
      actions['report-error'] = {
        message: 'Report an error',
        handler: this.reportError,
      }
    );
  };

  addCardActions = (actions, exercise) => {
    return (
      actions.details = {
        message: 'Question details',
        handler: this.showDetails,
      }
    );
  };

  @action.bound reportError(ev, exercise) {
    ExerciseHelpers.openReportErrorPage(exercise.wrapper, this.props.course);
  }

  @action.bound toggleFeedback() {
    this.displayFeedback = !this.displayFeedback;
  }

  @action.bound showDetails(ev, selectedExercise) {
    this.currentView = 'details';
    this.selectedExercise = selectedExercise.wrapper;
  }

  getExerciseIsSelected = (exercise) => {
    return exercise.isSelected;
  };

  @action.bound setCurrentSection(currentSection) {

    this.currentSection = currentSection;
  }

  @computed get displayedExercises() {
    const selected = TaskPlanStore.getExercises(this.props.planId);
    // we display all the exercises that were previously selected
    // or that are assignable homeworks for the given pages
    return this.props.exercises.where( e =>
      (e.isHomework && e.isAssignable && this.props.pageIds.includes(e.page.id)) ||
        selected.includes(e.id)
    );
  }

  render() {
    const { pageIds, exercises, course } = this.props;
    if (exercises.isFetching({ pageIds }) || isEmpty(pageIds)){
      return <Loading />;
    }

    const sharedProps = {
      exercises: this.displayedExercises,
      book: course.referenceBook,
      onExerciseToggle: this.onExerciseToggle,
      getExerciseActions: this.getExerciseActions,
      getExerciseIsSelected: this.getExerciseIsSelected,
      pageIds,
    };

    let body;
    if (this.currentView == 'details') {
      body = (
        <ExerciseDetails
          {...sharedProps}
          topScrollOffset={0}
          selectedExercise={this.selectedExercise}
          onSectionChange={this.setCurrentSection}
          selectedSection={this.currentSection}
          displayFeedback={this.displayFeedback}
          onShowCardViewClick={this.onShowCardViewClick} />
      );
    } else {
      body = (
        <ExerciseCards
          {...sharedProps}
          focusedExercise={this.focusedExercise}
          onShowDetailsViewClick={this.onShowDetailsViewClick} />
      );
    }

    const controls =
      <ExerciseControls
        canReview={true}
        currentView={this.currentView}
        canAdd={this.props.canEdit}
        reviewClicked={this.props.hide}
        onCancel={this.props.cancel}
        addClicked={this.props.onAddClick}
        planId={this.props.planId}
        onShowCardViewClick={this.onShowCardViewClick}
        onShowDetailsViewClick={this.onShowDetailsViewClick}
        sectionizerProps={{
          currentSection: this.currentSection,
          onSectionClick: this.setCurrentSection,
          nonAvailableWidth: 600,
          chapter_sections: course.referenceBook.sectionsForPageIds(pageIds),
        }} />;


    return (
      <PinnedHeaderFooterCard
        containerBuffer={140}
        forceShy
        pinnedUntilScroll
        header={controls}
        cardType="homework-builder"
      >
        <TourRegion id="add-homework-select-exercises" courseId={course.id}>
          {body}
        </TourRegion>
      </PinnedHeaderFooterCard>
    );
  }
}

export default AddExercises;
