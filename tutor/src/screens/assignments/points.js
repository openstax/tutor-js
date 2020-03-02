import { React, PropTypes, styled, action, observer, computed } from 'vendor';
import { colors } from 'theme';
import { AssignmentBuilder } from './builder';
import { flatMap } from 'lodash';
import { SuretyGuard } from 'shared';
import { Icon } from 'shared';
import Question from 'shared/components/question';
import S from '../../helpers/string';

const QuestionPreview = styled.div`
  border: 1px solid ${colors.neutral.lighter};
  margin: 2rem;
  &:first-of-type {
   .ox-icon-arrow-up { display: none; }
  }
  &:last-of-type {
   .ox-icon-arrow-down { display: none; }
  }
`;


const Header = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  background: ${colors.neutral.lighter}
  padding: 1rem;
  margin-bottom: 1rem;
  font-weight: bold;
`;

const ExerciseNumber = styled.div`
  font-size: 1.5rem;
`;

const Actions = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const Controls = styled.div`
  flex-basis: 10rem;
  display: flex;
  justify-content: flex-end;
  input {
    padding: 0.5rem;
  }
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
    question: PropTypes.object.isRequired,
    index:    PropTypes.number.isRequired,
    exerciseIndex: PropTypes.number.isRequired,
    questionIndex: PropTypes.number.isRequired,

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

  @computed get points() {
    return this.props.ux.plan.settings
      .exercises[this.props.exerciseIndex]
      .points[this.props.questionIndex];
  }

  @action.bound setPoints(ev) {
    const points = parseInt(ev.target.value);
    this.props.ux.plan.settings
      .exercises[this.props.exerciseIndex]
      .points[this.props.questionIndex] = points;

  }

  getActionButtons() {
    const { ux } = this.props;

    if (!ux.canEdit) { return null; }

    return (
      <Actions>
        <Input value={S.numberWithOneDecimalPlace(this.points)} onChange={this.setPoints} /> Points
        <Controls>
          {this.props.questionIndex == 0 && (
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


  render() {
    const { question } = this.props;

    return (
      <QuestionPreview className="openstax-exercise-preview">
        <Header>
          <ExerciseNumber>
            Question {this.props.index + 1}
          </ExerciseNumber>
          {this.getActionButtons()}
        </Header>
        <div className="card-body">
          <Question
            className="openstax-question-preview"
            question={question}
            hideAnswers={false}
            choicesEnabled={false}
            displayFormats={false}
            type="teacher-preview"
          />
        </div>
      </QuestionPreview>
    );
  }

}

const Review = observer(({ ux }) => {

  let index = 0;

  return (
    <AssignmentBuilder
      title="Set points and review"
      ux={ux}
    >
      {flatMap(ux.selectedExercises, (ex, exIndex) => (
        ex.content.questions.map((q, qIndex) => (
          <ReviewExerciseCard
            key={`${exIndex}-${qIndex}`}
            ux={ux}
            exerciseIndex={exIndex}
            questionIndex={qIndex}
            index={index++}
            question={q}
            exercise={ex}
            canEdit={ux.canEdit}
          />
        ))))}
    </AssignmentBuilder>
  );
});

Review.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default Review;
