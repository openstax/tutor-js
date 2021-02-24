import { Router, React, Factory } from '../helpers';
import Exercise from '../../src/components/exercise';
import ExerciseModel from '../../src/models/exercises/exercise';

// eslint-disable-next-line react/prop-types
jest.mock('../../../shared/src/components/html', () => ({ html }) =>
    html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);
jest.mock('react-dom', () => ({
    findDOMNode: () => ({}),
}));

describe('Exercises component', () => {
    let exercise;
    let props;

    beforeEach(() => {
        const exercises = Factory.exercisesMap();
        exercise = exercises.array[0].array[0];
        props = {
            exercises,
            match: {
                params: {
                    uid: exercise.uid,
                },
            },
        };
    });

    it('renders and matches snapshot', () => {
        expect.snapshot(<Router><Exercise {...props} /></Router>).toMatchSnapshot();
    });

    it('renders with intro and a multiple questions when exercise is MC', () => {
        const ex = new ExerciseModel(Factory.data('Exercise', { multipart: true }));
        props.exercises.set(ex.uid, ex);
        props.match.params.uid = ex.uid;
        expect.snapshot(<Router><Exercise {...props} /></Router>).toMatchSnapshot();
    });

    it('can save edits', () => {
        expect(props.exercises.get(exercise.uid)).not.toBeUndefined();
        const ex = mount(<Router><Exercise {...props} /></Router>);
        ex.find('.nickname input').simulate('change', {
            target: { value: 'MY-NICK-NAME' },
        });
        expect(exercise.nickname).toEqual('MY-NICK-NAME');
        ex.unmount();
    });

    it('resets fields when model is new', () => {
        const ex = mount(<Router><Exercise {...props} /></Router>);
        props.exercises.createNewRecord();
        ex.setProps({ match: { params: { uid: 'new' } } });
        expect(ex.debug()).toMatchSnapshot();
        ex.unmount();
    });

    it('should show Science Practice tag if the book selected is AP Physics or AP Bio', () => {
        const ex = mount(<Router><Exercise {...props} /></Router>);
        //AP Physics
        ex.find('.tag-type.book select').simulate('change', { target: { value: 'stax-apphys' } });
        expect(ex).toHaveRendered('.tag-type.sciencePractice');
        ex.find('.tag-type.sciencePractice select').simulate('change', { target: { value: 'argumentation' } });
        expect(props.exercises.get(exercise.uid).tags.withType('science-practice').raw).toEqual('science-practice:argumentation');
        //deletes the science practice field if other than AP Physics or AP Bio is selected
        ex.find('.tag-type.book select').simulate('change', { target: { value: 'stax-econ' } });
        expect(ex).not.toHaveRendered('.tag-type.sciencePractice');
        expect(props.exercises.get(exercise.uid).tags.withType('science-practice')).toBeFalsy();
        //AP Bio
        ex.find('.tag-type.book select').simulate('change', { target: { value: 'stax-apbio' } });
        expect(ex).toHaveRendered('.tag-type.sciencePractice');
    });
});
