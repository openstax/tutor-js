import QuestionsOverview from '../../../src/screens/assignment-edit/questions-overview';

describe('QuestionsOverview', function() {
    const props = {
        ux: {
            plan: {
              settings: {
                exercises: [],
              },
            },
            selectedExercises: [
              {
                content: {
                  questions: [ {}, {} ]
                },
                tags: { important: {} },
              },
            ],
            numTutorSelections: 1,
        },
    };

    it('renders the correct Tutor question numbers after a selected multipart question', () => {
        expect.snapshot(<QuestionsOverview {...props} />).toMatchSnapshot();
    });
});
