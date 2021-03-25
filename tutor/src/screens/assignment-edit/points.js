import { React, PropTypes, styled, action, observer } from 'vendor';
import { AssignmentBuilder } from './builder';
import HomeworkQuestions, { ExerciseNumber } from '../../components/homework-questions';
import QuestionsOverview from './questions-overview';
import { Icon, SuretyGuard } from 'shared';
import S from '../../helpers/string';
import { colors } from 'theme';

const Heading = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${colors.neutral.lighter};
  padding: 1rem;
`;

const Controls = styled.div`
  flex-basis: 10rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  input {
    padding: 0.5rem;
  }
  .btn {
    display: flex;
    align-items: center;
  }
  .ox-icon {
    height: 18px;
    width: 18px;
  }
`;

const Actions = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const Input = styled.input`
  height: 3rem;
  width: 5rem;
  text-align: center;
  margin-right: 1rem;
  border: 1px solid #34bdd7;
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

const TagsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  > * { margin-left: 1rem; }
`;
const QuestionTags = observer(({ info: { exercise } }) => {
    const { dok, blooms, lo } = exercise.tags.important;

    return (
        <TagsWrapper>
            <span>{lo && lo.asString}</span>
            <span>{dok && dok.asString}</span>
            <span>{blooms && blooms.asString}</span>
        </TagsWrapper>
    );
});

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
        const { styleVariant, label, info: { questionIndex, points } } = this.props;
        const formattedPoints = S.numberWithOneDecimalPlace(points);

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
                            <Icon size="xs" type="close" />
                        </SuretyGuard>
                    </Controls>
                </Actions>
            </Heading>
        );
    }
}

const Points = observer(({ ux }) => (
    <AssignmentBuilder ux={ux} title="Set points and review">
        <StyledHomeworkQuestions
            questionsInfo={ux.plan.questionsInfo}
            questionInfoRenderer={(props) => <QuestionTags {...props} />}
            headerContentRenderer={(props) => <QuestionHeading {...props} ux={ux} />}
        />
        <QuestionsOverview ux={ux} />
    </AssignmentBuilder>
));


Points.propTypes = {
    ux: PropTypes.object.isRequired,
};

export default Points;
