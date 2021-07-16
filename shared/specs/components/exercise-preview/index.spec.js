import Snapshot from 'react-test-renderer';
import { filter } from 'lodash';
import ExercisePreview from '../../../src/components/exercise-preview';
import Factories from '../../factories';

// eslint-disable-next-line react/prop-types
jest.mock('../../../src/components/html', () => ({ html }) =>
    html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);

describe('Exercise Preview Component', function() {
    let props;
    let exercise;

    beforeEach(() => {
        exercise = Factories.exercise({});
        props = {
            exercise,
        };
    });

    it('renders and matches snapshot', () => {
        const preview = Snapshot.create(<ExercisePreview {...props} />);
        expect(preview.toJSON()).toMatchSnapshot();
        preview.unmount();
    });

    it('displays "solution is public" for exercises with public solutions', () => {
        props.exercise.solutions_are_public = true;
        const preview = Snapshot.create(<ExercisePreview {...props} />);
        expect(preview.toJSON()).toMatchSnapshot();
        preview.unmount();
    });

    it('sets the className when displaying feedback', () => {
        const preview = mount(<ExercisePreview {...props} displayFeedback={true} />);
        expect(preview).toHaveRendered('.card.openstax-exercise-preview.is-displaying-feedback');
        expect(Snapshot.create(<ExercisePreview {...props} />).toJSON()).toMatchSnapshot();
        preview.unmount();
    });

    it('can hide the answers', function() {
        props.hideAnswers = true;
        const preview = mount(<ExercisePreview {...props} />);
        expect(preview).not.toHaveRendered('.answers-table');
        expect(preview).toHaveRendered('.card.answers-hidden');
        expect(Snapshot.create(<ExercisePreview {...props} />).toJSON()).toMatchSnapshot();
        preview.unmount();
    });

    it('can render question formats', () => {
        props.displayFormats = true;
        const preview = mount(<ExercisePreview {...props} />);
        expect(preview.find('.formats-listing span').map(f => f.text())).toEqual([
            'free-response', 'multiple-choice',
        ]);
        expect(Snapshot.create(<ExercisePreview {...props} />).toJSON()).toMatchSnapshot();
        preview.unmount();
    });

    it('renders nickname', () => {
        props.displayNickname = true;
        const preview = mount(<ExercisePreview {...props} />);
        expect(preview.text()).toContain(`Nickname:${props.exercise.nickname}`);
    });

    it('does not render overlay by default', () => {
        const preview = mount(<ExercisePreview {...props} />);
        expect(preview).not.toHaveRendered('.controls-overlay');
    });

    it('callbacks are called when overlay and actions are clicked', function() {
        const onSelect = jest.fn();
        const actions = {
            include: {
                message: 'ReInclude question',
                handler: jest.fn(),
            },
        };
        Object.assign(props, { overlayActions: actions, onOverlayClick: onSelect });
        const preview = mount(<ExercisePreview {...props} />);
        expect(preview).toHaveRendered('.controls-overlay');
        preview.find('.controls-overlay').simulate('click');
        expect(onSelect).toHaveBeenCalled();
        preview.find('.controls-overlay .action.include').simulate('click');
        expect(actions.include.handler).toHaveBeenCalled();
        expect(Snapshot.create(<ExercisePreview {...props} />).toJSON()).toMatchSnapshot();
        preview.unmount();
    });

    it('hides context if missing', function() {
        props.exercise.context = '';
        const preview = mount(<ExercisePreview {...props} />);
        expect(preview).not.toHaveRendered('.context');
        expect(Snapshot.create(<ExercisePreview {...props} />).toJSON()).toMatchSnapshot();
        preview.unmount();
    });

    it('limits tags', () => {
        const preview = mount(<ExercisePreview {...props} />);
        const importantTags = filter(exercise.tags.all, 'isImportant');
        expect(preview.find('.exercise-tag')).toHaveLength(importantTags.length + 1);
        props.displayAllTags = true;
        preview.setProps(props);
        expect(preview.find('.exercise-tag').map(t => t.text())).toHaveLength(exercise.tags.all.length + 1);
        expect(Snapshot.create(<ExercisePreview {...props} />).toJSON()).toMatchSnapshot();
        preview.unmount();
    });

});
