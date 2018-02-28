/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import _ from 'underscore';
import React from 'react';
import { observer } from 'mobx-react';
import { observable, computed, action } from 'mobx';
import BS from 'react-bootstrap';
import ScrollTo from '../../helpers/scroll-to';
import { ExerciseStore } from '../../flux/exercise';
import { ExercisePreview } from 'shared';
import PagingNavigation from '../paging-navigation';
import NoExercisesFound from './no-exercises-found';
import Icon from '../icon';
import { ExercisesMap } from '../../models/exercises';
import Book from '../../models/reference-book';
import { ArrayOrMobxType } from 'shared/helpers/react';

@observer
class ExerciseDetails extends React.Component {
  static displayName = 'ExerciseDetails';

  static propTypes = {
    book:                   React.PropTypes.instanceOf(Book).isRequired,
    exercises:              React.PropTypes.instanceOf(ExercisesMap).isRequired,
    // courseId:              React.PropTypes.string.isRequired,
    // ecosystemId:           React.PropTypes.string.isRequired,
    selectedExercise:      React.PropTypes.object.isRequired,
    selectedSection:       React.PropTypes.string,
    exercises:             React.PropTypes.object.isRequired,
    onSectionChange:       React.PropTypes.func,
    onExerciseToggle:      React.PropTypes.func.isRequired,
    onShowCardViewClick:   React.PropTypes.func.isRequired,
    topScrollOffset:       React.PropTypes.number,
    getExerciseActions:    React.PropTypes.func.isRequired,
    getExerciseIsSelected: React.PropTypes.func.isRequired,
  };

  static defaultProps = { topScrollOffset: 40 };

  scroller = new ScrollTo({
    windowImpl: this.props.windowImpl,
    onAfterScroll: this.onAfterScroll,
  });


  @observable currentIndex;
  @observable currentSection;

  @computed get exercises() {
    return this.props.exercises.array; //this.flattenExercises(this.props);
  }

  componentDidMount() {
    this.scroller.scrollToSelector('.exercise-controls-bar')
  }

  componentWillMount() {
    let currentSection;
    const { selectedExercise } = this.props;
    let currentIndex = (currentSection = 0);
    for (let index = 0; index < this.exercises.length; index++) {
      const exercise = this.exercises[index];
      if ((selectedExercise != null ? selectedExercise.id : undefined) === exercise.id) {
        this.currentIndex = index;
        this.currentSection = exercise.page.chapter_section.asString;
        break;
      }
    }
  }

  // componentWillReceiveProps(nextProps) {
  //
  //   const { selectedSection } = nextProps;
  //   const nextState = { exercises };
  //   if (selectedSection && (selectedSection !== this.state.currentSection)) {
  //     for (let index = 0; index < exercises.length; index++) {
  //       const exercise = exercises[index];
  //       const section = ExerciseStore.getChapterSectionOfExercise(this.props.ecosystemId, exercise);
  //       if (selectedSection === section) {
  //         nextState.currentSection = selectedSection;
  //         nextState.currentIndex = index;
  //         break;
  //       }
  //     }
  //   }
  //   return (
  //     this.setState(nextState)
  //   );
  // }

  // flattenExercises = () => {
  //   const groups = this.props.exercises.grouped;
  //   const exercises = [];
  //   for (let section of Array.from(_.keys(groups).sort())) {
  //     for (let exercise of Array.from(groups[section])) {
  //       exercises.push(exercise);
  //     }
  //   }
  //   return (
  //     exercises
  //   );
  // };

  onPrev = () => { return this.moveTo(this.currentIndex - 1); };
  onNext = () => { return this.moveTo(this.currentIndex + 1); };

  @action.bound moveTo(index) {
    this.currentIndex = index;
    this.exercise = this.exercises[index];
    const section = this.exercise.page.chapter_section.asString;
    if (this.currentSection !== section) {
      this.currentSection = section;
      if (this.props.onSectionChange) { this.props.onSectionChange(this.currentSection) };
    }
  }

  getValidMovements = () => {
    return {
      prev: this.currentIndex !== 0,
      next: this.currentIndex !== (this.exercises.length - 1),
    };
  };

  render() {
    const exercise = this.exercises[this.currentIndex] || _.first(this.exercises);
    if (!exercise) {
      return (
        <NoExercisesFound />
      );
    }

    const moves = this.getValidMovements();

    const isExcluded = ExerciseStore.isExerciseExcluded(exercise.id);

    return (

      <div className="exercise-details">
        <div className="controls">
          <a
            className="show-cards"
            onClick={_.partial(this.props.onShowCardViewClick, _, exercise)}>
            <Icon type="th-large" />
            {' Back to Card View\
        '}
          </a>
        </div>
        <div className="content">
          <PagingNavigation
            isForwardEnabled={moves.next}
            isBackwardEnabled={moves.prev}
            onForwardNavigation={this.onNext}
            onBackwardNavigation={this.onPrev}
            scrollOnNavigation={false}>
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
