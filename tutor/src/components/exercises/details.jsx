import PropTypes from 'prop-types';
import React from 'react';
import { first, partial, findIndex } from 'lodash';
import { observer } from 'mobx-react';
import { observable, computed, action } from 'mobx';
import { ExercisePreview } from 'shared';
import PagingNavigation from '../paging-navigation';
import NoExercisesFound from './no-exercises-found';
import { Icon } from 'shared';
import ChapterSection from '../../models/chapter-section';
import { ExercisesMap } from '../../models/exercises';
import Book from '../../models/reference-book';

@observer
class ExerciseDetails extends React.Component {
  static displayName = 'ExerciseDetails';

  static propTypes = {
    book:                  PropTypes.instanceOf(Book).isRequired,
    exercises:             PropTypes.instanceOf(ExercisesMap).isRequired,
    selectedExercise:      PropTypes.object.isRequired,
    onExerciseToggle:      PropTypes.func.isRequired,
    onShowCardViewClick:   PropTypes.func.isRequired,
    getExerciseActions:    PropTypes.func.isRequired,
    getExerciseIsSelected: PropTypes.func.isRequired,
    selectedSection:       PropTypes.instanceOf(ChapterSection),
    displayFeedback:       PropTypes.bool,
    onSectionChange:       PropTypes.func,
    windowImpl:            PropTypes.object,
    exerciseType:          PropTypes.string,
    sectionHasExercises:   PropTypes.bool,
    onSelectSections:      PropTypes.func,
  };

  @observable currentIndex;
  @observable currentSection;

  @computed get exercises() {
    return this.props.exercises.array;
  }

  UNSAFE_componentWillMount() {
    const { selectedExercise } = this.props;
    if (selectedExercise) {
      this.currentIndex = findIndex(this.exercises, selectedExercise);
      if (-1 == this.currentIndex) this.currentIndex = 0;
      this.currentSection = selectedExercise.page.chapter_section;
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.props.selectedSection) {
      return;
    }
    if (!prevProps.selectedSection || !this.props.selectedSection.eq(prevProps.selectedSection)) {
      const index = this.exercises.findIndex(
        ex => ex.page.chapter_section.eq(this.props.selectedSection)
      );
      if (index != -1) {
        this.currentIndex = index;
      }
    }
  }

  @action.bound onPrev() { this.moveTo(this.currentIndex - 1); }
  @action.bound onNext() { this.moveTo(this.currentIndex + 1); }

  @action.bound moveTo(index) {
    this.currentIndex = index;
    const exercise = this.exercises[index];
    const section = exercise.page.chapter_section;
    if (this.currentSection !== section) {
      this.currentSection = section;
      if (this.props.onSectionChange) {
        this.props.onSectionChange(this.currentSection);
      }
    }
  }

  getValidMovements = () => {
    return {
      prev: this.currentIndex !== 0,
      next: this.currentIndex !== (this.exercises.length - 1),
    };
  };

  render() {
    const exercise = this.exercises[this.currentIndex] || first(this.exercises);
    if (!exercise) {
      return (
        <NoExercisesFound
          isHomework={this.props.exerciseType === 'homework'}
          sectionHasExercises={this.props.sectionHasExercises}
          onSelectSections={this.props.onSelectSections}/>
      );
    }
    const moves = this.getValidMovements();
    return (
      <div className="exercise-details">
        <div className="controls">
          <a
            className="show-cards"
            onClick={partial(this.props.onShowCardViewClick, partial.placeholder, exercise)}
          >
            <Icon type="th" size="lg" /> Back to Card View
          </a>
        </div>

        <PagingNavigation
          isForwardEnabled={moves.next}
          isBackwardEnabled={moves.prev}
          onForwardNavigation={this.onNext}
          onBackwardNavigation={this.onPrev}
          scrollOnNavigation={false}
        >
          <div className="exercise-content">
            <ExercisePreview
              className="exercise-card"
              isVerticallyTruncated={false}
              isSelected={this.props.getExerciseIsSelected(exercise)}
              overlayActions={this.props.getExerciseActions(exercise)}
              displayFeedback={this.props.displayFeedback}
              extractedInfo={exercise}
              exercise={exercise.content}
              actionsOnSide={true}
            />
          </div>
        </PagingNavigation>

      </div>
    );
  }
}

export default ExerciseDetails;
