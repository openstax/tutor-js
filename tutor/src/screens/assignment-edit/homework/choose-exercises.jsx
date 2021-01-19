import { React, PropTypes, observer, observable, action, styled } from 'vendor';
import Loading from 'shared/components/loading-animation';
import ExerciseHelpers from '../../../helpers/exercise';
import ExerciseControls from './exercise-controls';
import ExerciseDetails from '../../../components/exercises/details';
import AddEditQuestionModal from '../../../components/add-edit-question';
import { DeleteExerciseModal } from '../../../components/add-edit-question/modals';
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
  @observable displayFeedback = true;
  @observable focusedExercise;
  @observable selectedExercise;
  @observable showAddEditQuestionModal = false;
  @observable showDeleteQuestionModal = false;

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

  @action.bound onDeleteExercise() {
    this.props.ux.exercises.deleteExercise(this.props.ux.course, this.selectedExercise);
    this.showDeleteQuestionModal = false;
    this.currentView = 'cards';
  }

  getExerciseActions = (exercise) => {
    const { ux } = this.props;
    const isUserGeneratedQuestion = exercise.belongsToUser(User);

    const actions = {};
    if (exercise.isSelected) {
      actions.exclude = {
        message: 'Remove question',
        handler: ux.onExerciseToggle,
      };
    } else {
      actions.include = {
        message: 'Include question',
        handler: ux.onExerciseToggle,
      };
    }
    if (this.currentView === 'details') {
      this.addDetailsActions(actions, exercise, isUserGeneratedQuestion);
    } else {
      this.addCardActions(actions, exercise, isUserGeneratedQuestion);
    }
    return actions;
  };

  addDetailsActions = (actions, exercise, isUserGeneratedQuestion) => {
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

    this.addCopyEditAction(actions, exercise);

    if (isUserGeneratedQuestion) {
      actions.deleteExercise = {
        message: 'Delete question',
        handler: () => this.showDeleteQuestionModal = true,
      };
    } else {
      actions['report-error'] = {
        message: 'Suggest a correction',
        handler: this.reportError,
      };
    }
  };

  addCopyEditAction = (actions, exercise) => {
    const isUserGeneratedQuestion = exercise.belongsToUser(User);
    if (exercise.canCopy) {
      actions.copyEdit = {
        message: `${!isUserGeneratedQuestion ? 'Copy & Edit' : 'Edit'}`,
        handler: this.onEditExercise,
      };

    }
  }

  addCardActions = (actions, exercise) => {
    action.details = {
      message: 'Details',
      handler: this.showDetails,
    };

    this.addCopyEditAction(actions, exercise);

    actions.details = {
      message: 'Details',
      handler: this.showDetails,
    };

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
      onExerciseToggle: ux.onExerciseToggle,
      getExerciseActions: this.getExerciseActions,
      getExerciseIsSelected: this.getExerciseIsSelected,
      pageIds: ux.selectedPageIds,
      questionType: 'teacher-preview',
    };

    let body;
    if (this.currentView == 'details') {
      body = (
        <ExerciseDetails
          {...sharedProps}
          course={ux.course}
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
          book={ux.referenceBook}
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
          showingDetails={this.currentView === 'details'}
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
        <DeleteExerciseModal
          show={this.showDeleteQuestionModal}
          onHide={() => this.showDeleteQuestionModal = false} 
          onDelete={this.onDeleteExercise} />
      </TourRegion>
    );
  }
}

export default ChooseExercises;
