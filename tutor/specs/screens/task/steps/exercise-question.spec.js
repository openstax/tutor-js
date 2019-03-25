import ExerciseQuestion from '../../../../src/screens/task/step/exercise-question';
import { Factory, FakeWindow } from '../../../helpers';
import UX from '../../../../src/screens/task/ux';
import { setFreeResponse } from '../helpers';

jest.mock('../../../../src/screens/task/ux');
jest.mock('../../../../../shared/src/components/html', () => ({ html }) =>
  html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);

describe('Exercise Free Response', () => {
  let props;

  beforeEach(() => {
    const step = Factory.studentTask({ type: 'homework', stepCount: 1 }).steps[0];
    const ux = new UX();
    ux.course = Factory.course();

    props = { ux, step, question: step.content.questions[0] };
  });

  it('switches from free response to m/c', () => {
    const eq = mount(<ExerciseQuestion {...props} />);
    expect(eq).toHaveRendered('FreeResponseInput');
    setFreeResponse(eq, { value: 'this is real answer' });
    expect(eq).not.toHaveRendered('FreeResponseInput');
    expect(eq).toHaveRendered('FreeResponseReview');
    expect(eq).toHaveRendered('AnswersTable');
  });

  it('can answer question', () => {
    const { step } = props;
    const eq = mount(<ExerciseQuestion {...props} />);
    setFreeResponse(eq, { value: 'this is real answer' });
    eq.find('Answer button').at(1).simulate('click');
    eq.find('AsyncButton').simulate('click');
    expect(props.ux.onAnswerSave).toHaveBeenCalledWith(
      step, step.content.questions[0].answers[1],
    );

    console.log('befre save')

    // emulate pending request
    step.api.requestsInProgress.set('1', {});

    expect(step.api.isPending).toBe(true);

    console.log("update");

    eq.update();

    //console.log(eq.find('AsyncButton').debug());

    // AsyncButton

    // expect(props.step.answer_id).toEqual(
    //   props.step.content.questions[0].answers[1].id
    // );

    // [1].id
    //   expect(props.step.answer_id).toEqual(
    //     props.step.content.questions[1].id
    //   );
  });

});
