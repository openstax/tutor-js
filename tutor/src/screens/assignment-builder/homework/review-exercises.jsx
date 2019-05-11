import { React, PropTypes, styled } from '../../../helpers/react';
import { compact, map, isEmpty } from 'lodash';
import Loading from 'shared/components/loading-animation';
import { Icon } from 'shared';
import { TaskPlanStore, TaskPlanActions } from '../../../flux/task-plan';
import { ExercisePreview, SuretyGuard } from 'shared';
import { observer } from 'mobx-react';
import Course from '../../../models/course';
import Book from '../../../models/reference-book';
import sharedExercises, { ExercisesMap, Exercise } from '../../../models/exercises';
import ExerciseControls from './exercise-controls';
import ExerciseTable from './exercises-table';

const Header = styled.div`
  display: flex;
  width: 100%;

`;

const Controls = styled.div`
  flex: 1;
  text-align: right;
`;

@observer
class ReviewExerciseCard extends React.Component {

  static propTypes = {
    planId:   PropTypes.string.isRequired,
    exercise: PropTypes.instanceOf(Exercise).isRequired,
    canEdit:  PropTypes.bool.isRequired,
    isFirst:  PropTypes.bool.isRequired,
    isLast:   PropTypes.bool.isRequired,
    index:    PropTypes.number.isRequired,
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
    const { isFirst, isLast } = this.props;

    return (
      <Controls className="pull-right card-actions">
        {!isFirst && <Icon
          size="xs"
          type="arrow-up"
          onClick={this.moveExerciseUp}
          className="-move-exercise-up circle"
        />}
        {!isLast && <Icon
          size="xs"
          type="arrow-down"
          onClick={this.moveExerciseDown}
          className="-move-exercise-down circle"
        />}
        <SuretyGuard
          title={false}
          onConfirm={this.removeExercise}
          okButtonLabel="Remove"
          placement="left"
          message="Are you sure you want to remove this exercise?"
        >
          <Icon size="xs" className="-remove-exercise circle" type="close" />
        </SuretyGuard>
      </Controls>
    );
  }

  renderHeader() {
    const actionButtons = this.getActionButtons();
    return (
      <Header className="-exercise-header">
        <span className="exercise-number">
          {this.props.index + 1}
        </span>
        {actionButtons}
      </Header>
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

export default
@observer
class ReviewExercises extends React.Component {

  static propTypes = {
    course:     PropTypes.instanceOf(Course).isRequired,
    exercises:  PropTypes.instanceOf(ExercisesMap),
    planId:     PropTypes.string.isRequired,
    canEdit:    PropTypes.bool,
    canAdd:     PropTypes.bool,
    showSectionTopics: PropTypes.func.isRequired,
  };

  static defaultProps = {
    exercises: sharedExercises,
  };

  componentWillMount() {
    const ecosystem_id = TaskPlanStore.getEcosystemId(this.props.planId);
    const exercise_ids = TaskPlanStore.getExercises(this.props.planId);
    const { course } = this.props;
    const book = course.ecosystem_id == ecosystem_id ?
      course.referenceBook : new Book({ id: ecosystem_id });
    this.props.exercises.ensureExercisesLoaded({ course, book, exercise_ids });
  }

  render() {
    const { canEdit, canAdd, showSectionTopics, course, planId } = this.props;

    if (this.props.exercises.api.isPending) { return <Loading />; }

    const exercises = compact(map(
      TaskPlanStore.getExercises(planId),
      (exId) => this.props.exercises.get(exId),
    ));

    if (isEmpty(exercises)) {
      return (
        <div className="panel alert alert-danger">
          Unable to display exercises for this assignment. Students can still view the assignment.
        </div>
      );
    }

    return (
      <div className="homework-builder-view">
        <ExerciseControls
          unDocked
          canAdd={canAdd}
          addClicked={showSectionTopics}
          hideDisplayControls={true}
          planId={planId}
        />
        <ExerciseTable
          course={course}
          planId={planId}
          exercises={exercises}
        />
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
      </div>
    );
  }

}
