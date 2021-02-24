import Renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import Factory from '../../factories';
import PreviewControls from '../../../src/components/preview/controls';


describe('Exercise controls component', function() {
    let exercise;
    let props;

    beforeEach(() => {
        const exercises = Factory.exercisesMap();
        exercise = exercises.array[0].array[0];
        props = {
            exercises,
            history: {
                push: jest.fn(),
            },
            match: {
                params: {
                    uid: exercise.uid,
                },
            },
        };
    });

    it('renders and matches snapshot', () => {
        const ex = Renderer.create(<MemoryRouter><PreviewControls {...props} /></MemoryRouter>);
        expect(ex.toJSON()).toMatchSnapshot();
        ex.unmount();
    });

});
