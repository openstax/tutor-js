import { React, PropTypes, styled, action } from 'vendor';
import { isEmpty } from 'lodash';
import Loading from 'shared/components/loading-animation';
import { Icon } from 'shared';
import { ExercisePreview, SuretyGuard } from 'shared';
import { observer } from 'mobx-react';
import ExerciseControls from './exercise-controls';
import ExerciseTable from './exercises-table';
import UX from '../ux';

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
    ux: PropTypes.instanceOf(UX).isRequired,
    exercise: PropTypes.object.isRequired,
    isFirst:  PropTypes.bool.isRequired,
    isLast:   PropTypes.bool.isRequired,
    range:    PropTypes.string.isRequired,
  };

  @action.bound moveExerciseUp() {
    this.props.ux.plan.moveExercise(this.props.exercise, -1);
  }

  @action.bound moveExerciseDown() {
    this.props.ux.plan.moveExercise(this.props.exercise, 1);
  }

  @action.bound removeExercise() {
    this.props.ux.plan.removeExercise(this.props.exercise);
  }

  getActionButtons() {
    const { ux } = this.props;

    if (!ux.canEdit) { return null; }
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
          {this.props.range}
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
          panelStyle="default"
        />
      </div>
    );
  }
}

export default
@observer
class ReviewExercises extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
  };

  wrapper = React.createRef();

  componentDidMount() {
    this.props.ux.onExercisesReviewMount(this.wrapper.current);
  }

  renderPreviews() {
    const { ux } = this.props;
    let count = 1;

    return ux.selectedExercises.map((ex, i) => {
      let range = `${count}`;
      if (ex.content.questions.length > 1) {
        range = `${range} - ${count + ex.content.questions.length - 1}`;
      }
      count += ex.content.questions.length;

      return (
        <ReviewExerciseCard
          ux={ux}
          range={range}
          key={ex.id}
          exercise={ex}
          isFirst={i === 0}
          canEdit={ux.canEdit}
          isLast={i === (ux.selectedExercises.length - 1)}
        />
      );
    });
  }

  render() {
    const { ux } = this.props;

    if (ux.exercises.api.isPending) { return <Loading />; }

    if (isEmpty(ux.selectedExercises)) {
      return (
        <div className="panel alert alert-danger">
          Unable to display exercises for this assignment. Students can still view the assignment.
        </div>
      );
    }

    return (
      <div className="homework-builder-view" ref={this.wrapper}>
        <ExerciseControls
          ux={ux}
          unDocked
          hideDisplayControls={true}
        />
        <ExerciseTable ux={ux} />
        <div className="card-list exercises">
          {this.renderPreviews()}
        </div>
      </div>
    );
  }

}
