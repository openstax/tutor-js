import ExerciseControls from '../../../../src/screens/assignment-edit/homework/exercise-controls';

describe('ExerciseControls', function() {
    const props = {
        ux: {
            numMCQs: 1,
            numWRQs: 2,
            numTutorSelections: 3,
            totalSelections: 6,
        },
        sectionizerProps: {
            chapter_sections: [],
        },
    };

    it('renders the correct question counts', () => {
        expect.snapshot(<ExerciseControls {...props} />).toMatchSnapshot();
    });
});
