/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import _ from 'underscore';
import React from 'react';
import BS from 'react-bootstrap';

import { ExerciseStore } from '../../flux/exercise';
import { ExercisePreview } from 'shared';
import PagingNavigation from '../paging-navigation';
import NoExercisesFound from './no-exercises-found';
import Icon from '../icon';

class ExerciseDetails extends React.Component {
  static displayName = 'ExerciseDetails';

  static propTypes = {
    courseId:              React.PropTypes.string.isRequired,
    ecosystemId:           React.PropTypes.string.isRequired,
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
  state = {};
  scrollingTargetDOM = () => { return document; };

  getScrollTopOffset = () => {
    return (
      this.props.topScrollOffset
    );
  };

  componentDidMount() {
    return (
      this.scrollToSelector('.exercise-controls-bar')
    );
  }

  componentWillMount() {
    let currentSection;
    const { selectedExercise } = this.props;
    const exercises = this.flattenExercises(this.props);
    let currentIndex = (currentSection = 0);
    for (let index = 0; index < exercises.length; index++) {
      const exercise = exercises[index];
      if ((selectedExercise != null ? selectedExercise.id : undefined) === exercise.id) {
        currentIndex = index;
        currentSection = ExerciseStore.getChapterSectionOfExercise(this.props.ecosystemId, exercise);
        break;
      }
    }
    return (
      this.setState({ exercises, currentIndex, currentSection })
    );
  }

  componentWillReceiveProps(nextProps) {
    const exercises = this.flattenExercises(nextProps);
    const { selectedSection } = nextProps;
    const nextState = { exercises };
    if (selectedSection && (selectedSection !== this.state.currentSection)) {
      for (let index = 0; index < exercises.length; index++) {
        const exercise = exercises[index];
        const section = ExerciseStore.getChapterSectionOfExercise(this.props.ecosystemId, exercise);
        if (selectedSection === section) {
          nextState.currentSection = selectedSection;
          nextState.currentIndex = index;
          break;
        }
      }
    }
    return (
      this.setState(nextState)
    );
  }

  flattenExercises = (props) => {
    const groups = props.exercises.grouped;
    const exercises = [];
    for (let section of Array.from(_.keys(groups).sort())) {
      for (let exercise of Array.from(groups[section])) {
        exercises.push(exercise);
      }
    }
    return (
      exercises
    );
  };

  onPrev = () => { return this.moveTo(this.state.currentIndex - 1); };
  onNext = () => { return this.moveTo(this.state.currentIndex + 1); };

  moveTo = (index) => {
    const exercise = this.state.exercises[index];
    const section = ExerciseStore.getChapterSectionOfExercise(this.props.exerciseId, exercise);
    if (this.props.onSectionChange && (this.state.currentSection !== section)) {
      // defer is needed to allow setState to complete before callback is fired
      // otherwise component recieves props with the new section and doesn't know it's already on it
      // causing it to jump to the first exercise in section
      _.defer(() => this.props.onSectionChange(section));
    }
    return (
      this.setState({ currentIndex: index, currentSection: section })
    );
  };

  getValidMovements = () => {
    return (
      {
        prev: this.state.currentIndex !== 0,
        next: this.state.currentIndex !== (this.state.exercises.length - 1),
      }
    );
  };

  render() {
    const exercise = this.state.exercises[this.state.currentIndex] || _.first(this.state.exercises);
    if (!exercise) {
      return (
        <NoExercisesFound />
      );
    }

    const moves = this.getValidMovements();

    const isExcluded = ExerciseStore.isExerciseExcluded(exercise.id);

    return (

      (
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
                exercise={exercise}
                actionsOnSide={true} />
            </PagingNavigation>
          </div>
        </div>
      )

    );
  }
}

export default ExerciseDetails;
