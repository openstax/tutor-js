import React from 'react';
import { Button } from 'react-bootstrap';
import { compact, map, isEmpty } from 'lodash';
import Loading from '../../loading-screen';
import Icon from '../../icon';
import { TaskPlanStore, TaskPlanActions } from '../../../flux/task-plan';
import { ExercisePreview, SuretyGuard, PinnedHeaderFooterCard } from 'shared';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import Course from '../../../models/course';

import sharedExercises, { ExercisesMap, Exercise } from '../../../models/exercises';
import { ArrayOrMobxType } from 'shared/helpers/react';

import ExerciseControls from './exercise-controls';
import ExerciseTable from './exercises-table';

@observer
class ReviewExerciseCard extends React.Component {

  static propTypes = {
    planId:   React.PropTypes.string.isRequired,
    exercise: React.PropTypes.instanceOf(Exercise).isRequired,
    canEdit:  React.PropTypes.bool.isRequired,
    isFirst:  React.PropTypes.bool.isRequired,
    isLast:   React.PropTypes.bool.isRequired,
    index:    React.PropTypes.number.isRequired,
  };

  moveExerciseUp = () => {
    TaskPlanActions.moveExercise(this.props.planId, this.props.exercise.id, -1);
  };

  moveExerciseDown = () => {
    TaskPlanActions.moveExercise(this.props.planId, this.props.exercise.id, 1);
  };

  removeExercise = () => {
    TaskPlanActions.removeExercise(this.props.planId, this.props.exercise.id);
  };

  getActionButtons() {
    if (!this.props.canEdit) { return null; }

    return (
      <span className="pull-right card-actions">
        {!this.props.isFirst ? <Button onClick={this.moveExerciseUp} className="btn-xs -move-exercise-up circle">
          <Icon type="arrow-up" />
        </Button> : undefined}
        {this.props.isLast && (
           <Button
             onClick={this.moveExerciseDown}
             className="btn-xs -move-exercise-down circle">
             <Icon type="arrow-down" />
           </Button>)}
        <SuretyGuard
          title={false}
          onConfirm={this.removeExercise}
          okButtonLabel="Remove"
          placement="left"
          message="Are you sure you want to remove this exercise?"
        >
          <Button className="btn-xs -remove-exercise circle">
            <Icon type="close" />
          </Button>
        </SuretyGuard>
      </span>
    );
  }

  renderHeader() {
    const actionButtons = this.getActionButtons();
    return (
      <span className="-exercise-header">
        <span className="exercise-number">
          {this.props.index + 1}
        </span>
        {actionButtons}
      </span>
    );
  }

  render() {
    const { exercise } = this.props;

    return (
      <div className="openstax exercise-wrapper">
        <ExercisePreview
          exercise={exercise.content}
          className="exercise-card"
          isInteractive={false}
          isVerticallyTruncated={true}
          isSelected={false}
          header={this.renderHeader()}
          panelStyle="default" />
      </div>
    );
  }
}

@observer
export default class ReviewExercises extends React.Component {

  static propTypes = {
    course:     React.PropTypes.instanceOf(Course).isRequired,
    exercises:  React.PropTypes.instanceOf(ExercisesMap),
    planId:     React.PropTypes.string.isRequired,
  };

  static defaultProps = {
    exercises: sharedExercises,
  };

  componentWillMount() {
    const page_ids = TaskPlanStore.getTopics(this.props.planId);
    this.props.exercises.ensureLoaded({ course: this.props.course, page_ids });
  }

  render() {
    const { canEdit, canAdd, showSectionTopics, course, planId } = this.props;

    if (this.props.exercises.api.isPending) { return <Loading />; }

    const exercises = compact(map(
      TaskPlanStore.getExercises(planId),
      (exId) => this.props.exercises.get(exId),
    ));

    if (isEmpty(exercises)) {
      return <div className="-bug">Failed loading exercises</div>;
    }

    const controls = (
      <ExerciseControls
        canAdd={canAdd}
        addClicked={showSectionTopics}
        hideDisplayControls={true}
        planId={planId}
      />
    );

    const exerciseTable =
      <ExerciseTable exercises={exercises} course={course} planId={planId} />;

    return (
      <PinnedHeaderFooterCard containerBuffer={50} header={controls} cardType="homework-builder">
        {exerciseTable}
        <div className="card-list exercises">
          {map(exercises, (ex, i) =>
            <ReviewExerciseCard
              key={ex.id}
              index={i}
              planId={planId}
              canEdit={canEdit}
              isFirst={i === 0}
              isLast={i === (exercises.length - 1)}
              exercise={ex} />)}
        </div>
      </PinnedHeaderFooterCard>
    );
  }

}
// ReviewExercises.propTypes = {
//   planId: React.PropTypes.string.isRequired,
//   courseId: React.PropTypes.string.isRequired,
//   canEdit: React.PropTypes.bool,
//   sectionIds: React.PropTypes.array.isRequired,
//   showSectionTopics: React.PropTypes.func.isRequired,
// };


// export default ReviewExercises;
