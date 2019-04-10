import {
  React, PropTypes, observer, styled,
} from '../../../helpers/react';
import UX from '../ux';
import { ArbitraryHtmlAndMath } from 'shared';
import { TaskStepCard } from './card';
import ExerciseQuestion from './exercise-question';
import Step from '../../../models/student-tasks/step';

const ExerciseStimulus = ({ isHidden, content }) => {
  if (isHidden || !content.stimulus_html) { return null; }
  return (
    <ArbitraryHtmlAndMath
      className="exercise-stimulus"
      block={true}
      html={content.stimulus_html}
    />
  );
};
ExerciseStimulus.propTypes = {
  content: PropTypes.object,
  isHidden: PropTypes.bool,
};

const StyledExercise = styled(TaskStepCard)`
    font-size: 1.8rem;
`;

export default
@observer
class ExerciseTaskStep extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
    step: PropTypes.instanceOf(Step).isRequired,
    isFirstMPQ: PropTypes.bool,
    windowImpl: PropTypes.object,
  }

  render() {
    const { ux, step, isFirstMPQ } = this.props;
    const { content } = step;

    return (
      <StyledExercise
        step={step}
      >
        <ExerciseStimulus isHidden={!isFirstMPQ} content={content} />
        {content.questions.map((q, i) =>
          <ExerciseQuestion
            ux={ux}
            index={i}
            key={q.id}
            step={step}
            question={q}
          />)}
      </StyledExercise>
    );
  }

}
