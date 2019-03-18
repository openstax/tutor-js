import {
  React, PropTypes, observer, styled,
} from '../../../helpers/react';
import UX from '../ux';
import { Question } from 'shared';
import QuestionModel from 'shared/model/exercise/question';


const ExerciseQuestionWrapper = styled.div`

`;

export default
@observer
class ExerciseQuestion extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
    question: PropTypes.instanceOf(QuestionModel).isRequired,
  }

  render() {
    const { ux, question } = this.props;

    return (
      <ExerciseQuestionWrapper>
        <Question question={question} task={ux.task} />
      </ExerciseQuestionWrapper>
    );
  }
}
