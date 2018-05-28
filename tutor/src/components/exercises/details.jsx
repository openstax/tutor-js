import React from 'react';
import { first, partial, findIndex } from 'lodash';
import { observer } from 'mobx-react';
import { observable, computed, action } from 'mobx';

import { ExercisePreview } from 'shared';
import PagingNavigation from '../paging-navigation';
import NoExercisesFound from './no-exercises-found';
import Icon from '../icon';
import { ExercisesMap } from '../../models/exercises';
import Book from '../../models/reference-book';

@observer
class ExerciseDetails extends React.Component {
  static displayName = 'ExerciseDetails';

  static propTypes = {
    book:                  React.PropTypes.instanceOf(Book).isRequired,
    exercises:             React.PropTypes.instanceOf(ExercisesMap).isRequired,
    selectedExercise:      React.PropTypes.object.isRequired,
    onExerciseToggle:      React.PropTypes.func.isRequired,
    onShowCardViewClick:   React.PropTypes.func.isRequired,
    getExerciseActions:    React.PropTypes.func.isRequired,
    getExerciseIsSelected: React.PropTypes.func.isRequired,
    selectedSection:       React.PropTypes.string,
    displayFeedback:       React.PropTypes.bool,
    onSectionChange:       React.PropTypes.func,
    windowImpl:            React.PropTypes.object,
  };

  @observable currentIndex;
  @observable currentSection;

  @computed get exercises() {
    return this.props.exercises.array; //this.flattenExercises(this.props);
  }

  componentWillMount() {
    const { selectedExercise } = this.props;
    if (selectedExercise) {
      this.currentIndex = findIndex(this.exercises, selectedExercise);
      if (-1 == this.currentIndex) this.currentIndex = 0;
      this.currentSection = selectedExercise.page.chapter_section.asString;
    }
  }

  @action.bound onPrev() { this.moveTo(this.currentIndex - 1); }
  @action.bound onNext() { this.moveTo(this.currentIndex + 1); }

  @action.bound moveTo(index) {
    this.currentIndex = index;
    this.exercise = this.exercises[index];
    const section = this.exercise.page.chapter_section.asString;
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
        <NoExercisesFound />
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
            <Icon type="th-large" /> Back to Card View
          </a>
        </div>
        <div className="content">
          <PagingNavigation
            isForwardEnabled={moves.next}
            isBackwardEnabled={moves.prev}
            onForwardNavigation={this.onNext}
            onBackwardNavigation={this.onPrev}
            scrollOnNavigation={false}
          >
            <ExercisePreview
              className="exercise-card"
              isVerticallyTruncated={false}
              isSelected={this.props.getExerciseIsSelected(exercise)}
              overlayActions={this.props.getExerciseActions(exercise)}
              displayFeedback={this.props.displayFeedback}
              exercise={exercise.content}
              actionsOnSide={true} />
          </PagingNavigation>
        </div>
      </div>
    );
  }
}

export default ExerciseDetails;
