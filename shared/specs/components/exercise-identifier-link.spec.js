import { React } from 'shared/specs/helpers';

import ExerciseIdentifierLink from '../../src/components/exercise-identifier-link';
import Exercise from '../../src/helpers/exercise';

describe('Exercise Identifier Link', function() {
    let props = null;

    beforeEach(() =>
        props = {
            bookUUID: '27275f49-f212-4506-b3b1-a4d5e3598b99',
            exerciseId: '123442',
            project: 'tutor',
            related_content: [{
                chapter_section: { toString() { return '1.2'; } },
                title: 'Introduction to Apples',
            }],
        });

    it('matches snapshot', () => {
        expect.snapshot(<ExerciseIdentifierLink {...props} />).toMatchSnapshot();
    });

    it('reads the parts from props and sets the url', function() {
        const link = shallow(<ExerciseIdentifierLink {...props} />);
        expect(link).toHaveRendered(`a[href="${Exercise.ERRATA_FORM_URL}?source=tutor&location=123442%201.2%20Introduction%20to%20Apples&book=College%20Physics"]`);
    });

    it('falls back to context if props are missing', function() {
        delete props.bookUUID;
        delete props.project;
        const link = shallow(
            <ExerciseIdentifierLink {...props} />,
            {
                context: {
                    bookUUID: '08df2bee-3db4-4243-bd76-ee032da173e8',
                    oxProject: 'TESTING',
                },
            },
        );
        expect(link).toHaveRendered(
            `a[href="${Exercise.ERRATA_FORM_URL}?source=TESTING&location=123442%201.2%20Introduction%20to%20Apples&book=Principles%20of%20Microeconomics"]`
        );
    });

    it('opens in new tab', function() {
        const link = shallow(<ExerciseIdentifierLink {...props} />);
        expect(link).toHaveRendered('a[target="_blank"]');
    });

    it('renders the the exercise id before the trouble link', function() {
        const link = shallow(<ExerciseIdentifierLink {...props} />);
        expect(link.text()).toMatch(`ID# ${props.exerciseId}`);
    });

});
