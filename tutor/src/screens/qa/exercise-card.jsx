import React from 'react';
import classnames from 'classnames';
import { ExerciseStore } from '../../flux/exercise';
import String from '../../helpers/string';
import { ExercisePreview } from 'shared';
import { toJS } from 'mobx';
import UX from './ux';

export default class ExerciseCard extends React.Component {

  static propTypes = {
    ux: React.PropTypes.instanceOf(UX).isRequired,
    exercise: React.PropTypes.object.isRequired,
  };

  renderHeader = () => {
    return (
      <div className="types">
        {this.props.ux.exerciseTypes.map(type => (
          <span
            key={type}
            className={classnames(type, { 'is-ignored': this.props.ux.isTypeIgnored(type) })}
          >
             {String.titleize(type)}
          </span>
        ))}
      </div>
    );
  };

  render() {
    let freeResponse;
    const {exercise, ux} = this.props;
//    const ignoredTypes = ExerciseStore.getExerciseTypes(exercise);

    //if (_.any(types) && _.every( types, pt => ignoredTypes[pt])) { return null; }
    const editUrl = exercise.url.replace(/@\d+/, '@draft');

    //const doQuestionsHaveFormat = exercise.hasFreeResponse; // ExerciseStore.doQuestionsHaveFormat('free-response', {exercise});

//    if (show2StepPreview) {
      // freeResponse = _.map(doQuestionsHaveFormat, function(hasFreeResponse) {
      //   if (hasFreeResponse) { return <div className="exercise-free-response-preview" />; }
      // });
//    }
    //exerciseDataFilter(exercise, this.props)}
    return (
      <ExercisePreview
        exercise={toJS(exercise)}
        className="exercise"
        header={this.renderHeader()}
        displayFormats={true}
        questionFooters={freeResponse}
        displayAllTags={true}
        displayFeedback={true}
      >
        <a target="_blank" className="edit-link" href={editUrl}>
          edit
        </a>
      </ExercisePreview>
  );
  }
}
