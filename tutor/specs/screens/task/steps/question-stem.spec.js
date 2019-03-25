import QuestionStem from '../../../../src/screens/task/step/question-stem';
import { Factory } from '../../../helpers';

describe('Question Stem', () => {
  let props;

  beforeEach(() => {
    const step = Factory.studentTask({ type: 'homework', stepCount: 1 }).steps[0];
    props = {
      question: step.content.content.questions[0],
    };
  });

  it('matches snapshot', () => {
    expect(<QuestionStem {...props} />).toMatchSnapshot();
  });
});
