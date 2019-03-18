import {
  React, PropTypes, observer, styled, action,
} from '../../../helpers/react';
import Notes from '../../../components/notes';
import RelatedContentLink from '../../../components/related-content-link';
import { AsyncButton, ArbitraryHtmlAndMath } from 'shared';
import UX from '../ux';
import { ChapterSectionMixin, ExerciseBadges, CardBody, ExerciseWithScroll, ExControlButtons } from 'shared';
import ExerciseQuestion from './exercise-question';

const StepWrapper = styled.div`


`;

const StepFooter = ({ }) => {
  const { pinned, courseId, id, taskId, review } = this.props;

  return (
    <div className="step-footer">
      {this.renderFooter({ stepId: id, taskId, courseId, review })}
    </div>
  );

};

const getCurrentCard = () => {
  debugger;
};

const getReadingForStep = () => {

};

export default
@observer
class ExerciseTaskStep extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
    windowImpl: PropTypes.object,
  }

  @action.bound goToStep(step) {
    this.props.ux.goToStep(step);
  } // ={_.partial(goToStep, _, true)}


  @action.bound onStepCompleted() {
    this.props.ux.onStepCompleted(
      this.props.ux.currentStep,
    );
  }

  render() {
    const { ux } = this.props;
    const {
      course, task, canGoForward, currentStep: step,
    } = ux;
    const { content } = step;

    return (
      <StepWrapper className="exercise-step">
        {content.content.questions.map((q, i) =>
          <ExerciseQuestion key={q.id} ux={ux} question={q} index={i} />)}
      </StepWrapper>
    );
  }

}
