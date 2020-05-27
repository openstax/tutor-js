import AssignmentUX from '../../../src/screens/assignment-edit/ux';

describe('AssignmentUX', function() {
  const attrs = {
    plan: {
      exercises: [
        { isMultiChoice: true },
        { isMultiChoice: true },
        { isOpenEnded: true },
      ]
    },
    course: { gradingTemplates: [] }
  };

  it('renders the correct question counts', () => {
    const ux = new AssignmentUX(attrs);
    expect(ux.numMCQs).toBe(2);
    expect(ux.numWRQs).toBe(1);
    expect(ux.numExerciseSteps).toBe(3);
  });
});
