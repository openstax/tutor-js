import { C, React, Factory, runInAction } from '../../helpers';
import ExerciseControls from '../../../src/components/exercise/controls';
import { currentToasts } from '../../../../shared/src/model/toasts'

jest.mock('../../../../shared/src/model/toasts', () => ({
    setToastHandlers: jest.fn(),
    currentToasts: {
        add: jest.fn(),
    },
}));

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
                    uid: exercise.number,
                },
            },
        };
    });

    it('disables publish/draft if exercise is published', () => {
        const controls = mount(<C><ExerciseControls {...props} /></C>);
        expect(controls.find('button.publish').props().disabled).toBe(false);
        runInAction( () => exercise.published_at = new Date() )
        expect(controls.find('button.draft').props().disabled).toBe(false);
        expect(exercise.isPublishable).toBe(false);
        controls.update();
        expect(controls.find('button.publish').props().disabled).toBe(true);
        controls.unmount();
    });

    it('adds a toast when saved', () => {
        const controls = mount(<C><ExerciseControls {...props} /></C>);
        runInAction( () => exercise.published_at = new Date() )
        props.exercises.saveDraft = jest.fn(() => Promise.resolve());
        controls.find('button.draft').simulate('click');
        expect(props.exercises.saveDraft).toHaveBeenCalled();
        controls.unmount();
        return new Promise((done) => {
            setTimeout(() => {
                expect(currentToasts.add).toHaveBeenCalledWith({
                    handler: 'published', status: 'ok',
                    info: { isDraft: true, exercise },
                });
                done();
            });
        });
    });

    it('adds a toast when published', () => {
        const controls = mount(<C><ExerciseControls {...props} /></C>);
        runInAction( () => exercise.published_at = new Date() )
        props.exercises.publish = jest.fn(() => Promise.resolve());
        controls.find('button.publish').simulate('click');
        controls.find('ExerciseControls').instance().publishExercise();
        expect(props.exercises.publish).toHaveBeenCalled();
        controls.unmount();
        return new Promise((done) => {
            setTimeout(() => {
                expect(currentToasts.add).toHaveBeenCalledWith({
                    handler: 'published', status: 'ok',
                    info: { exercise },
                });
                expect(props.history.push).toHaveBeenCalledWith('/search');
                done();
            });
        });
    });

});
