import {
  React, PropTypes, observer, styled,
} from '../../../helpers/react';
import UX from '../ux';
import { ArbitraryHtmlAndMath as H } from 'shared';
import { TaskStepCard } from './card';
import ExerciseQuestion from './exercise-question';
import Step from '../../../models/student-tasks/step';
import Badges from 'shared/components/exercise-badges';
import Raven from '../../../models/app/raven';

const StyledExercise = styled(TaskStepCard)`
  font-size: 1.8rem;
  line-height: 3rem;
`;

const Preamble = ({ isHidden, content }) => {
  if (isHidden) { return null; }

  return (
    <React.Fragment>

      {content.context &&
        <H className="exercise-context"
          block html={content.context} />}

      {content.stimulus_html &&
        <H className="exercise-stimulus"
          block html={content.stimulus_html} />}

      {content.stem_html &&
        <H className="exercise-stem"
          block html={content.stem_html} />}

    </React.Fragment>
  );
};

Preamble.propTypes = {
  isHidden: PropTypes.bool,
  content: PropTypes.object,
};


export default
@observer
class ExerciseTaskStep extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
    step: PropTypes.instanceOf(Step).isRequired,
    isFollowupMPQ: PropTypes.bool,
    isMultiPart: PropTypes.bool,
    windowImpl: PropTypes.object,
  }

  constructor(props) {
    super(props);
    const { step } = props;
    if (!step.content || !step.content.questions) {
      this.logAndRetryFetch();
    }
  }

  logAndRetryFetch() {
    const { step } = this.props;
    step.fetch().then(() => {
      Raven.log(
        `No questions found on step id ${step.id} of type ${step.type}.  After re-fetch, questions found: ${!!(step.content && step.content.questions)}`,
      );
    });
  }

  render() {
    const { ux, step, isMultiPart, isFollowupMPQ } = this.props;
    const { content } = step;

    return (
      <StyledExercise
        step={step}
      >
        <Badges
          spacedPractice={step.isSpacedPractice}
          personalized={!isFollowupMPQ && step.isPersonalized}
          multiPart={isMultiPart && !isFollowupMPQ}
        />

        <Preamble
          content={content}
          isHidden={isFollowupMPQ} />

        {(content.questions || []).map((q, i) =>
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
