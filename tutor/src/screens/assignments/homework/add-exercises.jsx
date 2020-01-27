import { React, PropTypes, observer, observable, action } from 'vendor';
import Loading from 'shared/components/loading-animation';
import ExerciseHelpers from '../../../helpers/exercise';
import ExerciseControls from './exercise-controls';
import ExerciseDetails from '../../../components/exercises/details';
import ExerciseCards from '../../../components/exercises/cards';
import TourRegion from '../../../components/tours/region';

@observer
class AddExercises extends React.Component {
  static propTypes = {
    ux: PropTypes.object.isRequired,
  };

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

  addCardActions = (actions) => {
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
    return exercise.isSelected;
  };

  @action.bound setCurrentSection(currentSection) {
    this.props.ux.scroller.scrollToSelector(`[data-section='${currentSection}']`);
    this.currentSection = currentSection;
  }

  render() {
    const { ux, ux: { exercises } } = this.props;

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
          topScrollOffset={110}
          focusedExercise={this.focusedExercise}
          onShowDetailsViewClick={this.onShowDetailsViewClick} />
      );
    }

    return (
      <TourRegion id="add-homework-select-exercises"
        courseId={ux.course.id}
        className="homework-builder-view"
      >
        <ExerciseControls
          ux={ux}
          sectionizerProps={{
            currentSection: this.currentSection,
            onSectionClick: this.setCurrentSection,
            nonAvailableWidth: 600,
            chapter_sections: ux.selectedChapterSections,
          }} />
        {body}
      </TourRegion>
    );
  }
}

export default AddExercises;
