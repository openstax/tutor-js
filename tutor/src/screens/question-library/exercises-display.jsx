import React from 'react';
import { Button } from 'react-bootstrap';
import { keys, first, pluck, map, isEmpty } from 'lodash';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
import { PinnedHeaderFooterCard } from 'shared';
import Loading from '../../components/loading-screen';
import { ArrayOrMobxType } from 'shared/helpers/react';
import Icon from '../../components/icon';
import ExerciseControls from './exercise-controls';
import ExerciseDetails from '../../components/exercises/details';
import ExerciseCards from '../../components/exercises/cards';
import ScrollSpy from '../../components/scroll-spy';
import Sectionizer from '../../components/exercises/sectionizer';
import NoExercisesFound from './no-exercises-found';
import ExerciseHelpers from '../../helpers/exercise';
import Dialog from '../../components/tutor-dialog';
import TourRegion from '../../components/tours/region';
import Course from '../../models/course';
import sharedExercises, { ExercisesMap } from '../../models/exercises';

const ExerciseDetailsWrapper = props => (
  <TourRegion id="question-library-details" courseId={props.course.id}>
    <ExerciseDetails {...props} />
  </TourRegion>
);

const ExerciseCardsWrapper = props => (
  <TourRegion
    id="question-library-exercises"
    otherTours={['preview-question-library-exercises']}
    course={props.course.id}
  >
    <ExerciseCards {...props} />
  </TourRegion>
);

@observer
class ExercisesDisplay extends React.Component {

  static propTypes = {
    course:      React.PropTypes.instanceOf(Course).isRequired,
    exercises:   React.PropTypes.instanceOf(ExercisesMap),
    pageIds:     ArrayOrMobxType.isRequired,
    isHidden:    React.PropTypes.bool.isRequired,
    onShowDetailsViewClick: React.PropTypes.func.isRequired,
    onShowCardViewClick: React.PropTypes.func.isRequired,
    showingDetails: React.PropTypes.bool.isRequired,
    onSectionsDisplay: React.PropTypes.func.isRequired,
  };

  static defaultProps = {
    exercises: sharedExercises,
  };

  @observable filter = 'reading';
  @observable currentSection;
  @observable showingDetails = false;
  @observable displayFeedback = false;

  onFilterChange = (filter) => {
    this.filter = filter;
  };

  renderControls = (exercises) => {

    let sectionizerProps;

    if (this.props.showingDetails) {
      sectionizerProps = {
        currentSection: this.currentSection,
        onSectionClick: this.setCurrentSection,
      };
    }

    return (
      <ExerciseControls
        filter={this.filter}
        course={this.props.course}
        showingDetails={this.props.showingDetails}
        onFilterChange={this.onFilterChange}
        onSectionsDisplay={this.props.onSectionsDisplay}
        onShowCardViewClick={this.onShowCardViewClick}
        onShowDetailsViewClick={this.onShowDetailsViewClick}
        exercises={exercises}
      >
        <ScrollSpy dataSelector="data-section">
          <Sectionizer
            ref="sectionizer"
            {...sectionizerProps}
            nonAvailableWidth={600}
            onScreenElements={[]}
            chapter_sections={this.props.course.referenceBook.sectionsForPageIds(this.props.pageIds)}
          />
        </ScrollSpy>
      </ExerciseControls>
    );
  };

  // called by sectionizer and details view
  setCurrentSection = (currentSection) => {
    this.currentSection = currentSection;
  };

  @action.bound onShowDetailsViewClick(ev, exercise) {
    this.selectedExercise = exercise.wrapper;
    this.currentSection = this.selectedExercise.page.chapter_section.asString;
    this.props.onShowDetailsViewClick(ev, this.selectedExercise);
  }

  @action.bound onShowCardViewClick(ev, exercise) {
    // The pinned header doesn't notice when the elements above it are unhidden
    // and will never unstick by itself.

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
    // const isSelected = !ExerciseStore.isExerciseExcluded(exercise.id);
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
            bsStyle="primary"
            onClick={function() { return Dialog.hide(); }}
            bsStyle="primary">
            Cancel
          </Button>,
        ],
      });
    } else {
      this.props.course.saveExerciseExclusion({ exercise, is_excluded });
    }

  };

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
    if (this.props.showingDetails) {
      this.addDetailsActions(actions, exercise);
    } else {
      this.addCardActions(actions, exercise);
    }

    return (

      actions

    );
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
        message: 'Report an error',
        handler: this.reportError,
      }
    );
  };

  addCardActions = (actions) => {
    return (
      actions.details = {
        message: 'Question details',
        handler: this.onShowDetailsViewClick,
      }
    );
  };

  @action.bound reportError(ev, exercise) {
    ExerciseHelpers.openReportErrorPage(exercise.wrapper, this.props.course);
  }

  @action.bound toggleFeedback() {
    this.displayFeedback = !this.displayFeedback;
  }

  getExerciseIsSelected = (exercise) => {
    return exercise.is_excluded;
  };

  renderExercises = (exercises) => {
    if (exercises.isEmpty) { return <NoExercisesFound />; }

    const sharedProps = {
      exercises,
      course: this.props.course,
      book: this.props.course.referenceBook,
      pageIds: this.props.pageIds,
      onExerciseToggle: this.onExerciseToggle,
      getExerciseActions: this.getExerciseActions,
      getExerciseIsSelected: this.getExerciseIsSelected,
      topScrollOffset: 100,
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

  render() {
    const { pageIds, exercises, isHidden } = this.props;
    if (isHidden) {
      return null;
    }

    if (exercises.isFetching({ pageIds }) || isEmpty(pageIds)){
      return <Loading />;
    }

    return (
      <div className="exercises-display">
        <PinnedHeaderFooterCard
          containerBuffer={140}
          forceShy
          pinnedUntilScroll
          header={this.renderControls(exercises)}
          cardType="sections-questions"
        >
          {this.renderExercises(this.filter ? exercises[this.filter] : exercises.all)}
        </PinnedHeaderFooterCard>
      </div>
    );
  }
}


export default ExercisesDisplay;
