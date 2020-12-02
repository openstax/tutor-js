import {
  React, PropTypes, observable, action, observer, computed, ArrayOrMobxType, styled,
} from 'vendor';
import { Button } from 'react-bootstrap';
import { isEmpty, uniq, compact, map } from 'lodash';
import Loading from 'shared/components/loading-animation';
import { Icon } from 'shared';
import ExerciseControls from './exercise-controls';
import ExerciseDetails from '../../components/exercises/details';
import ExerciseCards from '../../components/exercises/cards';
import ExerciseHelpers from '../../helpers/exercise';
import Dialog from '../../components/tutor-dialog';
import TourRegion from '../../components/tours/region';
import AddEditQuestionModal from '../../components/add-edit-question';
import Course from '../../models/course';
import User from '../../models/user';
import sharedExercises, { ExercisesMap } from '../../models/exercises';
import Scroller from '../../helpers/scroll-to';
import { colors } from 'theme';

const StyledExerciseDisplay = styled.div`
  .controls-wrapper {
    position: sticky;
    top: 5.9rem;
    z-index: 10;
  }
  .homework-questions-info {
    background-color: white;
    padding: 3rem 4.2rem 1.2rem;
    font-size: 1.6rem;
    line-height: 2rem;
    color: ${colors.neutral.thin};
    strong {
      font-weight: 700;
    }
  }
`;

const TOP_SCROLL_OFFSET = 335;

const ExerciseDetailsWrapper = props => (
  <TourRegion id="question-library-details" courseId={props.course.id}>
    <ExerciseDetails {...props} />
  </TourRegion>
);
ExerciseDetailsWrapper.propTypes = {
  course: PropTypes.instanceOf(Course).isRequired,
};

const ExerciseCardsWrapper = props => (
  <TourRegion
    id="question-library-exercises"
    otherTours={['preview-question-library-exercises']}
    course={props.course.id}
  >
    <ExerciseCards {...props} />
  </TourRegion>
);
ExerciseCardsWrapper.propTypes = {
  course: PropTypes.instanceOf(Course).isRequired,
};

@observer
class ExercisesDisplay extends React.Component {

  static displayName = 'ExercisesDisplay';

  static propTypes = {
    course:                 PropTypes.instanceOf(Course).isRequired,
    pageIds:                ArrayOrMobxType.isRequired,
    exercises:              PropTypes.instanceOf(ExercisesMap),
    showingDetails:         PropTypes.bool.isRequired,
    onSelectSections:       PropTypes.func.isRequired,
    onShowCardViewClick:    PropTypes.func.isRequired,
    onShowDetailsViewClick: PropTypes.func.isRequired,
  };

  static defaultProps = {
    exercises: sharedExercises,
  };

  componentWillUnmount() {
    this.props.exercises.clear();
  }

  @observable exerciseTypeFilter = 'homework';
  @observable displayedExercises = this.props.exercises[this.exerciseTypeFilter];
  @observable filteredExercises = this.displayedExercises;
  @observable selectedExercise;

  @observable currentSection;
  @observable showingDetails = false;
  @observable displayFeedback = false;

  @observable showAddEditQuestionModal = false;

  scroller = new Scroller({ windowImpl: this.windowImpl });

  onExerciseTypeFilterChange = (exerciseTypeFilter) => {
    this.exerciseTypeFilter = exerciseTypeFilter;
    this.displayedExercises = this.props.exercises[this.exerciseTypeFilter];
    this.filteredExercises = this.displayedExercises;
    // scroll to top if exercise type is changed
    this.scroller.scrollToTop({ deferred: true });
  };

  @action.bound onDisplayAddEditQuestionModal(show) {
    if(!show) {this.selectedExercise = null;}
    this.showAddEditQuestionModal = !!show;
  }

  // called by sectionizer and details view
  setCurrentSection = (currentSection) => {
    this.currentSection = currentSection;
  };

  // called by question-filters that returns the filtered exercises
  onFilterHomeworkExercises = (filteredExercises) => {
    this.filteredExercises = filteredExercises;
  }

  @action.bound onShowDetailsViewClick(ev, exercise) {
    this.selectedExercise = exercise.wrapper;
    this.currentSection = this.selectedExercise.page.chapter_section;
    this.props.onShowDetailsViewClick(ev, this.selectedExercise);
  }

  @action.bound onShowCardViewClick(ev, exercise) {
    this.fromDetailsExercise = exercise;
    this.props.onShowCardViewClick(ev, this.fromDetailsExercise);
  }

  renderMinimumExclusionWarning = (minExerciseCount) => {
    return (
      [
        <Icon key="icon" type="exclamation" />,
        <div key="message" className="message">
          <p>
            Tutor needs at least {minExerciseCount} questions for this section to be
            included in spaced practice and personalized learning.
          </p>
          <p>
            If you exclude too many, your students will not get
            to practice on topics in this section.
          </p>
        </div>,
      ]
    );
  };

  onExerciseToggle = (ev, exerciseContent) => {
    const { exercises } = this.props;
    let minExerciseCount;
    const exercise = exerciseContent.wrapper;
    const is_excluded = !exercise.is_excluded;
    if (is_excluded) {
      minExerciseCount = exercises.isMinimumExcludedForPage(exercise.page);
    }

    if (is_excluded && false !== minExerciseCount) {
      Dialog.show({
        className: 'question-library-min-exercise-exclusions',
        title: '', body: this.renderMinimumExclusionWarning(minExerciseCount),
        buttons: [
          <Button
            key="exclude"
            onClick={() => {
              this.props.course.saveExerciseExclusion({ exercise, is_excluded });
              Dialog.hide();
            }}
          >
            Exclude
          </Button>,
          <Button
            key="cancel"
            variant="primary"
            onClick={function() { return Dialog.hide(); }}
            variant="primary">
            Cancel
          </Button>,
        ],
      });
    } else {
      this.props.course.saveExerciseExclusion({ exercise, is_excluded });
    }
  };

  @action.bound onEditExercise = (ev, exercise) => {
    this.selectedExercise = exercise.wrapper;
    this.onDisplayAddEditQuestionModal(ev, true);
  }

  getExerciseActions = (exercise) => {
    const actions = {};
    if (this.getExerciseIsSelected(exercise)) {
      actions.include = {
        message: 'Re-Include question',
        handler: this.onExerciseToggle,
      };
    } else {
      actions.exclude = {
        message: 'Exclude question',
        handler: this.onExerciseToggle,
      };
    }
    if (!exercise.isMultiPart) {
      const isUserGeneratedQuestion = exercise.belongsToCurrentUserProfileId(User.profile_id);
      actions.copyEdit = {
        message: `${!isUserGeneratedQuestion ? 'Copy & Edit question' : 'Edit'}`,
        handler: this.onEditExercise,
      };
    }
    if (this.props.showingDetails) {
      this.addDetailsActions(actions, exercise);
    } else {
      this.addCardActions(actions, exercise);
    }
    return actions;
  };

  addDetailsActions = (actions) => {
    if (this.displayFeedback) {
      actions['feedback-off'] = {
        message: 'Hide Feedback',
        handler: this.toggleFeedback,
      };
    } else {
      actions['feedback-on'] = {
        message: 'Show Feedback',
        handler: this.toggleFeedback,
      };
    }
    return (
      actions['report-error'] = {
        message: 'Suggest a correction',
        handler: this.reportError,
      }
    );
  };

  addCardActions = (actions, exercise) => {
    // For now, MPQ are not allowed to be edited
    if (!exercise.isMultiPart) {
      const isUserGeneratedQuestion = exercise.belongsToCurrentUserProfileId(User.profile_id);
      actions.copyEdit = {
        message: `${!isUserGeneratedQuestion ? 'Copy & Edit' : 'Edit'}`,
        handler: this.onEditExercise,
      };
    }
    actions.details = {
      message: 'Question details',
      handler: this.onShowDetailsViewClick,
    };
  };

  @action.bound reportError(ev, exercise) {
    ExerciseHelpers.openReportErrorPage(exercise.wrapper, this.props.course);
  }

  @action.bound toggleFeedback() {
    this.displayFeedback = !this.displayFeedback;
  }

  @computed get displayedChapterSections() {
    return uniq(compact(map(this.props.pageIds, (pageId) => {
      if (!this.props.exercises.forPageId(pageId).length) { return null; }
      const page = this.props.course.referenceBook.pages.byId.get(pageId);
      return (page && page.chapter_section.isPresent) ? page.chapter_section : null;
    })));
  }

  getExerciseIsSelected = (exercise) => {
    return exercise.is_excluded;
  };

  renderExercises = (exercises) => {
    const sharedProps = {
      exercises,
      course: this.props.course,
      book: this.props.course.referenceBook,
      pageIds: this.props.pageIds,
      onExerciseToggle: this.onExerciseToggle,
      getExerciseActions: this.getExerciseActions,
      getExerciseIsSelected: this.getExerciseIsSelected,
      topScrollOffset: TOP_SCROLL_OFFSET,
      onSelectSections: this.props.onSelectSections,
      exerciseType: this.exerciseTypeFilter,
      // exercises in this scope are already filtered
      // check if the SECTIONS SELECTED has exercises
      sectionHasExercises: !this.props.exercises[this.exerciseTypeFilter].isEmpty,
    };

    if (this.props.showingDetails) {
      return (
        <ExerciseDetailsWrapper
          {...sharedProps}
          selectedExercise={this.selectedExercise}
          selectedSection={this.currentSection}
          onSectionChange={this.setCurrentSection}
          onExerciseToggle={this.onExerciseToggle}
          displayFeedback={this.displayFeedback}
          onShowCardViewClick={this.onShowCardViewClick} />
      );
    } else {
      return (
        <ExerciseCardsWrapper
          {...sharedProps}
          watchEvent="change-exercise-"
          onExerciseToggle={this.onExerciseToggle}
          focusedExercise={this.fromDetailsExercise}
          onShowDetailsViewClick={this.onShowDetailsViewClick} />
      );
    }
  };

  renderHomeworkExercisesInfo = (exerciseType) => {
    if(exerciseType !== 'homework') return null;

    return (
      <div className="homework-questions-info">
        <p>
          <strong>Homework questions </strong>
          are varied in complexity and can be either multiple-choice or written-response. In this library,
          you can add your own questions, copy and edit OpenStax questions,
          or exclude questions not relevant to your course.
        </p>
      </div>
    );
  }

  render() {
    const { pageIds, exercises, course, onSelectSections, showingDetails } = this.props;
    if (isEmpty(pageIds)) {
      return null;
    }
    if (exercises.isFetching({ pageIds })) {
      return <Loading />;
    }
    return (
      <StyledExerciseDisplay>
        <div className="controls-wrapper">
          <ExerciseControls
            course={course}
            onSelectSections={onSelectSections}
            exerciseTypeFilter={this.exerciseTypeFilter}
            homeworkExercises={this.displayedExercises}
            onExerciseTypeFilterChange={this.onExerciseTypeFilterChange}
            onFilterHomeworkExercises={this.onFilterHomeworkExercises}
            displayedChapterSections={this.displayedChapterSections}
            showingDetails={showingDetails}
            topScrollOffset={TOP_SCROLL_OFFSET}
            showAddEditQuestionModal={this.showAddEditQuestionModal}
            onDisplayAddEditQuestionModal={this.onDisplayAddEditQuestionModal}
          />
        </div>
        {this.renderHomeworkExercisesInfo(this.exerciseTypeFilter)}
        <div className="exercises-display">
          {this.renderExercises(this.filteredExercises)}
        </div>
        <AddEditQuestionModal
          exerciseType={this.exerciseTypeFilter}
          exercise={this.selectedExercise}
          book={course.referenceBook}
          pageIds={pageIds}
          course={course}
          showModal={this.showAddEditQuestionModal}
          onDisplayModal={this.onDisplayAddEditQuestionModal} />
      </StyledExerciseDisplay>
    );
  }
}


export default ExercisesDisplay;
