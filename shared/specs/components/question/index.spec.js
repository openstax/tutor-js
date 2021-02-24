import Factories from '../../factories';
import Snapshot from 'react-test-renderer';
import Question from '../../../src/components/question';

// eslint-disable-next-line react/prop-types
jest.mock('../../../src/components/html', () => ({ className, html }) =>
    html ? <div className={className} dangerouslySetInnerHTML={{ __html: html }} /> : null
);

describe('Question Component', function() {
    let props = null;

    beforeEach(() => {
        const exercise = Factories.exercise();
        props = {
            question: exercise.questions[0],
            onChange: jest.fn(),
            type: 'student',
        };
    });

    it('renders and matches snapshot', () => {
        props.type = 'teacher-preview'; // hack to hide instructions
        expect(Snapshot.create(<Question {...props} />).toJSON()).toMatchSnapshot();
    });

    it('highlights when answer is clicked', () => {
        const q = mount(<Question {...props} />);
        const answer = q.find('.answers-answer').at(1);
        expect(answer.hasClass('answer-checked')).toEqual(false);
        answer.find('input').simulate('change', { target: { checked: true } });
        expect(props.onChange).toHaveBeenCalled();
    });

    it('renders the context when given', () => {
        props.context = 'THIS IS SOME STUFF TO EXPLAIN';
        const q = mount(<Question {...props} />);
        expect(q.text()).toContain('EXPLAIN');
    });
});
