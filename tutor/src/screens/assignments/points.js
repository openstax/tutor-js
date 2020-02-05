import { React, PropTypes, styled, action, observer } from 'vendor';
import { AssignmentBuilder } from './builder';
import { ExercisePreview, SuretyGuard } from 'shared';
import { Icon } from 'shared';

const Header = styled.div`
  display: flex;
  width: 100%;

`;

const Controls = styled.div`
  flex: 1;
  text-align: right;
`;

const Input = styled.input`
  height: 100%;
  width: 4rem;
  text-align: center;
  margin-right: 1rem;
`;

const MoveIcon = styled(Icon)`
  border-radius: 50%;
`;

@observer
class ReviewExerciseCard extends React.Component {

  static propTypes = {
    ux: PropTypes.object.isRequired,
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
        <Input value={1} />
        {!isFirst && <MoveIcon type="arrow-up" onClick={this.moveExerciseUp} data-direction="up" />}
        {!isLast && <MoveIcon type="arrow-down" onClick={this.moveExerciseDown} data-direction="down" />}
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

const Review = observer(({ ux }) => {
  let count = 1;

  const cards = ux.selectedExercises.map((ex, i) => {
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

  return (
    <AssignmentBuilder
      title="Set points and review"
      ux={ux}
    >
      {cards}
    </AssignmentBuilder>
  );
});

Review.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default Review;
