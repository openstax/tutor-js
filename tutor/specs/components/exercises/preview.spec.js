import { React, runInAction } from '../../helpers';
import ExercisePreviewWrapper from '../../../src/components/exercises/preview';
import Factory from '../../factories';

jest.mock('../../../../shared/src/components/html', () => ({ className, html }) =>
    html ? <div className={className} dangerouslySetInnerHTML={{ __html: html }} /> : null
);

describe('Exercise Preview Wrapper Component', function() {
    let exercise, props;

    beforeEach(() => {
        exercise = Factory.tutorExercise();
        props = {
            exercise,
            onShowDetailsViewClick: jest.fn(),
            onExerciseToggle:       jest.fn(),
            getExerciseIsSelected:  jest.fn(),
            getExerciseActions:     jest.fn().mockReturnValue({}),
        };
    });


    it('renders and matches snapshot', () => {
        expect.snapshot(<ExercisePreviewWrapper {...props} />).toMatchSnapshot();
    });

    it('re-renders when model is updated', () => {
        const preview = mount(<ExercisePreviewWrapper {...props} />);
        runInAction(() => exercise.content.questions[0].stem_html = 'THIS IS UPDATE!');
        expect(preview.text()).toContain('THIS IS UPDATE!');
    });

});
