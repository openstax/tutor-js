import Factories from '../factories';

describe('Exercise Model', () => {
  let exercise;
  beforeEach(() => exercise = Factories.exercise({}));

  it('can be created from fixture and serialized', () => {
    expect(exercise.serialize()).toMatchObject({
      version: expect.any(Number),
    });
  });


  it('can move questions up/down', () => {
    exercise = Factories.exercise({ multipart: true });
    const second = exercise.questions[1];
    exercise.moveQuestion(second, -1);
    expect(exercise.questions[0]).toBe(second);
    expect(() =>
      exercise.moveQuestion(second, -1)
    ).toThrow();

    const nextToLast = exercise.questions[exercise.questions.length - 2];
    exercise.moveQuestion(nextToLast, 1);
    expect(exercise.questions[exercise.questions.length - 1]).toBe(nextToLast);
    expect(() =>
      exercise.moveQuestion(nextToLast, 1)
    ).toThrow();
  });


});
