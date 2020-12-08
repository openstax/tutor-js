import { React, PropTypes, observer, observable, action, styled } from 'vendor';
import Loading from 'shared/components/loading-animation';
import ExerciseHelpers from '../../../helpers/exercise';
import ExerciseControls from './exercise-controls';
import ExerciseDetails from '../../../components/exercises/details';
import AddEditQuestionModal from '../../../components/add-edit-question';
import ExerciseCards from './cards';
import TourRegion from '../../../components/tours/region';
import User from '../../../models/user';
import { Body } from '../builder';
import { colors } from '../../../theme';

const StyledBody = styled(Body)`
  background: ${colors.neutral.lighter};
`;

@observer
class ChooseExercises extends React.Component {
  static propTypes = {
    ux: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    
  }

  @observable currentView = 'cards';
  @observable currentSection;
  @observable displayFeedback;
  @observable focusedExercise;
  @observable selectedExercise;
  @observable showAddEditQuestionModal = false;

  @action.bound onShowDetailsViewClick() {
    this.currentView = 'details';
  }

  @action.bound onShowCardViewClick(ev, exercise) {
    this.currentView = 'cards';
    this.focusedExercise = exercise;
  }

  @action.bound onDisplayAddEditQuestionModal(show) {
    if(!show) {this.selectedExercise = null;}
    this.showAddEditQuestionModal = !!show;
  }

  @action.bound onEditExercise = (ev, exercise) => {
    this.selectedExercise = exercise.wrapper;
    this.onDisplayAddEditQuestionModal(ev, true);
  }

  getExerciseActions = (exercise) => {
    const { ux } = this.props;

    const actions = {};
    if (exercise.isSelected) {
      actions.exclude = {
        message: 'Remove question',
        handler: ux.onExerciseToggle,
      };
    } else {
      actions.include = {
        message: 'Add question',
        handler: ux.onExerciseToggle,
      };
    }
    if (this.currentView === 'details') {
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
        message: 'Preview Feedback',
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
    action.details = {
      message: 'Question details',
      handler: this.showDetails,
    };
    if (exercise.canCopy) {
      const isUserGeneratedQuestion = exercise.belongsToCurrentUserProfileId(User.profile_id);
      actions.copyEdit = {
        message: `${!isUserGeneratedQuestion ? 'Copy & Edit' : 'Edit'}`,
        handler: this.onEditExercise,
      };
    }
    return (
      actions.details = {
        message: 'Question details',
        handler: this.showDetails,
      }
    );
  };

  @action.bound reportError(ev, exercise) {
    ExerciseHelpers.openReportErrorPage(exercise.wrapper, this.props.ux.course);
  }

  @action.bound toggleFeedback() {
    this.displayFeedback = !this.displayFeedback;
  }

  @action.bound showDetails(ev, selectedExercise) {
    this.currentView = 'details';
    this.selectedExercise = selectedExercise.wrapper;
  }

  getExerciseIsSelected = (exercise) => {
    return this.props.ux.isExerciseSelected(exercise);
  };

  @action.bound setCurrentSection(currentSection) {
    this.props.ux.scroller.scrollToSelector(`[data-section='${currentSection}']`);
    this.currentSection = currentSection;
  }

  render() {
    const { ux, ux: { exercises, filteredExercises, steps: { goBackward } } } = this.props;
    if (exercises.isFetching({ pageIds: ux.selectedPageIds })){
      return <Loading />;
    }

    const sharedProps = {
      exercises: ux.displayedExercises,
      book: ux.referenceBook,
      onExerciseToggle: ux.onExerciseToggle,
      getExerciseActions: this.getExerciseActions,
      getExerciseIsSelected: this.getExerciseIsSelected,
      pageIds: ux.selectedPageIds,
    };

    let body;
    if (this.currentView == 'details') {
      body = (
        <ExerciseDetails
          {...sharedProps}
          topScrollOffset={60}
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
          disableScroll
          focusedExercise={this.focusedExercise}
          onShowDetailsViewClick={this.onShowDetailsViewClick}
          filteredExercises={filteredExercises}
          goBackward={goBackward}
          
        />
      );
    }

    return (
      <TourRegion
        id="add-homework-select-exercises"
        courseId={ux.course.id}
      >
        <ExerciseControls
          ux={ux}
          sectionizerProps={{
            currentSection: this.currentSection,
            onSectionClick: this.setCurrentSection,
            nonAvailableWidth: 600,
            chapter_sections: ux.selectedChapterSections,
          }}
          onDisplayAddEditQuestionModal={this.onDisplayAddEditQuestionModal}/>
        <StyledBody>
          {body}
        </StyledBody>
        <AddEditQuestionModal
          exerciseType="homework"
          exercise={this.selectedExercise}
          book={ux.course.referenceBook}
          pageIds={ux.selectedPageIds}
          course={ux.course}
          showModal={this.showAddEditQuestionModal}
          onDisplayModal={this.onDisplayAddEditQuestionModal}
          exercises={exercises} />
      </TourRegion>
    );
  }
}

export default ChooseExercises;
