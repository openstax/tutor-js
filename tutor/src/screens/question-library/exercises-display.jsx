import React from 'react';
import { keys, first, pluck, map, isEmpty } from 'lodash';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { PinnedHeaderFooterCard } from 'shared';
import { ExerciseStore, ExerciseActions } from '../../flux/exercise';
import { TocStore } from '../../flux/toc';

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
    pageIds:     React.PropTypes.array,
  };

  static defaultProps = {
    exercises: sharedExercises,
  };

  @observable filter = 'reading';
  @observable currentSection;
  @observable showingDetails = false;

  // state = {
  //   filter: 'reading',
  //   showingCardsFromDetailsView: false,
  // };

  componentWillMount() { return ExerciseStore.on('change', this.update); }
  componentWillUnmount() { return ExerciseStore.off('change', this.update); }
  update = () => { return this.forceUpdate(); };

  onFilterChange = (filter) => {
    this.filter = filter;
  };

  renderControls = (exercises) => {

    let sectionizerProps;
    const sections = keys(exercises.all.grouped);

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
        onSectionSelect={this.scrollToSection}
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
            chapter_sections={sections} />
        </ScrollSpy>
      </ExerciseControls>
    );
  };

  // called by sectionizer and details view
  setCurrentSection = (currentSection) => {
    this.currentSection = currentSection;
  };

  @action.bound onShowDetailsViewClick(ev, exercise) {
    if (!exercise) { exercise = first(ExerciseStore.get(this.props.sectionIds)); }
    this.selectedExercise = exercise;
    this.currentSection = exercise.chapter_section.asString;
    this.props.onShowDetailsViewClick(ev, exercise);
  }

  @action.bound onShowCardViewClick(ev, exercise) {
    // The pinned header doesn't notice when the elements above it are unhidden
    // and will never unstick by itself.
    this.refs.controls.unPin();
    this.fromDetailsExercise = exercise;
    this.props.onShowCardViewClick(ev, exercise);
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

  onExerciseToggle = (ev, exercise) => {
    let minExerciseCount;
    const isSelected = !ExerciseStore.isExerciseExcluded(exercise.id);
    if (isSelected) {
      const validUids = pluck(map(this.props.sectionIds, TocStore.getSectionInfo), 'uuid');
      minExerciseCount = ExerciseStore.excludedAtMinimum(exercise, validUids);
    }
    if (isSelected && (minExerciseCount !== false)) {
      Dialog.show({
        className: 'question-library-min-exercise-exclusions',
        title: '', body: this.renderMinimumExclusionWarning(minExerciseCount),
        buttons: [
          <BS.Button
            key="exclude"
            onClick={() => {
                ExerciseActions.saveExerciseExclusion(this.props.courseId, exercise.id, isSelected);
                return (
                  Dialog.hide()
                );
            }}
          >
            Exclude
          </BS.Button>,
          <BS.Button
            key="cancel"
            bsStyle="primary"
            onClick={function() { return Dialog.hide(); }}
            bsStyle="primary">
            Cancel
          </BS.Button>,
        ],
      });
    } else {
      ExerciseActions.saveExerciseExclusion(this.props.courseId, exercise.id, isSelected);
    }
    return (
      this.forceUpdate()
    );
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
        handler: this.onShowDetailsViewClick,
      }
    );
  };

  reportError = (ev, exercise) => {
    return (
      ExerciseHelpers.openReportErrorPage(exercise, this.props.courseId, this.props.ecosystemId)
    );
  };

  @action.bound toggleFeedback() {
    this.displayFeedback = !this.state.displayFeedback;
  };

  getExerciseIsSelected = (exercise) => {
    return (
      ExerciseStore.isExerciseExcluded(exercise.id)
    );
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
      ecosystemId: this.props.ecosystemId,
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
          watchStore={ExerciseStore}
          watchEvent="change-exercise-"
          onExerciseToggle={this.onExerciseToggle}
          focusedExerciseId={this.fromDetailsExercise ? this.fromDetailsExercise.id : undefined}
          onShowDetailsViewClick={this.onShowDetailsViewClick} />
      );
    }
  };

  render() {
    const { course, exercises } = this.props;

    // if (ExerciseStore.isLoading() || isEmpty(this.props.sectionIds)) { return null; }
    // const exercises = ExerciseStore.groupBySectionsAndTypes(this.props.ecosystemId, this.props.sectionIds, { withExcluded: true });
    return (
      <div className="exercises-display">
        <PinnedHeaderFooterCard
          ref="controls"
          containerBuffer={50}
          header={this.renderControls(exercises)}
          cardType="sections-questions"
        >
          {this.renderExercises(
             this.filter ? exercises[this.filter] : exercises.all
          )}
        </PinnedHeaderFooterCard>
      </div>
    );
  }
}


export default ExercisesDisplay;
