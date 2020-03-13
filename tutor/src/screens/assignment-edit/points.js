import { React, PropTypes, styled, action, observer } from 'vendor';
import { AssignmentBuilder } from './builder';
import HomeworkQuestions from '../../components/homework-questions';
import { Icon, SuretyGuard } from 'shared';
import S from '../../helpers/string';


const Controls = styled.div`
  flex-basis: 10rem;
  display: flex;
  justify-content: flex-end;
  input {
    padding: 0.5rem;
  }
`;

const Actions = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
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


class QuestionControls extends React.Component {

  static propTypes = {
    ux:    PropTypes.object.isRequired,
    info:  PropTypes.object.isRequired,
  };

  @action.bound moveExerciseUp() {
    this.props.ux.plan.moveExercise(this.props.info.exercise, -1);
  }

  @action.bound moveExerciseDown() {
    this.props.ux.plan.moveExercise(this.props.info.exercise, 1);
  }

  @action.bound removeExercise() {
    this.props.ux.plan.removeExercise(this.props.info.exercise);
  }

  @action.bound setPoints(ev) {
    const points = parseFloat(S.numberWithOneDecimalPlace(ev.target.value));
    const { exerciseIndex, questionIndex } = this.props.info;
    this.props.ux.plan.settings.exercises[exerciseIndex].points[questionIndex] = points;
  }

  render() {
    const { ux, info: { questionIndex, points } } = this.props;
    const formattedPoints = S.numberWithOneDecimalPlace(points);

    if (!ux.canEdit) { return <Actions>{formattedPoints} Points</Actions>; }

    return (
      <Actions>
        <Input defaultValue={formattedPoints} onChange={this.setPoints} /> Points
        <Controls>
          {questionIndex == 0 && (
            <>
              <MoveIcon type="arrow-up" onClick={this.moveExerciseUp} data-direction="up" />
              <MoveIcon type="arrow-down" onClick={this.moveExerciseDown} data-direction="down" />
            </>)}
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
      </Actions>
    );
  }
}

const Review = observer(({ ux }) => {
  const controlsComponent = (props) => <QuestionControls {...props} ux={ux} />;

  return (
    <AssignmentBuilder ux={ux} title="Set points and review">
      <HomeworkQuestions
        questionsInfo={ux.plan.questionsInfo}
        controlsComponent={controlsComponent}
      />
    </AssignmentBuilder>
  );
});

Review.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default Review;
