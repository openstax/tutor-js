import {
  React, PropTypes, observer, styled,
} from '../../../helpers/react';
import UX from '../ux';
import { TaskStepCard } from './card';
import ExerciseQuestion from './exercise-question';
import Step from '../../../models/student-tasks/step';

const StyledExercise = styled(TaskStepCard)`
    font-size: 1.8rem;
`;

export default
@observer
class ExerciseTaskStep extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
    step: PropTypes.instanceOf(Step).isRequired,
    windowImpl: PropTypes.object,
  }

  render() {
    const { ux, step } = this.props;
    const { content } = step;

    return (
      <StyledExercise
        step={step}
      >
        {content.questions.map((q, i) =>
          <ExerciseQuestion key={q.id}
            step={step} ux={ux}
            question={q}
            index={i} />)}
      </StyledExercise>
    );
  }

}
