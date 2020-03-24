import { React, PropTypes, styled, action, useObserver } from 'vendor';
import { AssignmentBuilder } from './builder';
import HomeworkQuestions, { ExerciseNumber } from '../../components/homework-questions';
import { Icon, SuretyGuard } from 'shared';
import S from '../../helpers/string';
import { colors } from 'theme';

const Heading = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

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

const StyledHomeworkQuestions = styled(HomeworkQuestions)`
  padding: 0 3.8rem;
  overflow: hidden;
  border: 1px solid ${colors.neutral.pale};
  border-width: 0 1px;
`;


class QuestionHeading extends React.Component {

  static propTypes = {
    ux:    PropTypes.object.isRequired,
    info:  PropTypes.object.isRequired,
    styleVariant: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
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
    const { styleVariant, label, ux, info: { questionIndex, points } } = this.props;
    const formattedPoints = S.numberWithOneDecimalPlace(points);

    if (!ux.canEdit) { return <Actions>{formattedPoints} Points</Actions>; }

    return (
      <Heading>
        <ExerciseNumber variant={styleVariant}>
          {label}
        </ExerciseNumber>
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
      </Heading>
    );
  }
}

const Review = ({ ux }) => useObserver(() => (
  <AssignmentBuilder ux={ux} title="Set points and review">
    <StyledHomeworkQuestions
      questionsInfo={ux.plan.questionsInfo}
      headerContentRenderer={(props) => <QuestionHeading {...props} ux={ux} />}
    />
  </AssignmentBuilder>
));


Review.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default Review;
