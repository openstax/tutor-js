import QuestionStem from '../../../../src/screens/task/step/question-stem';
import { Factory, TimeMock } from '../../../helpers';

describe('Question Stem', () => {
    let props;
    TimeMock.setTo('2017-10-14T12:00:00.000Z');

    beforeEach(() => {
        const step = Factory.studentTask({ type: 'homework', stepCount: 1 }).steps[0];
        props = {
            questionNumber: 911,
            question: step.content.content.questions[0],
        };
    });

    it('matches snapshot', () => {
        expect(<QuestionStem {...props} />).toMatchSnapshot();
    });
});
