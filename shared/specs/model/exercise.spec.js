import Factories from '../factories';
import Factory from 'object-factory-bot';

describe('Exercise Helper', () => {
  let exercise;
  beforeEach(() => exercise = Factories.Exercise({}));

  it('can be created from fixture and serialized', () => {
    expect(exercise.serialize()).toMatchObject({
      version: expect.any(Number),
    });
  });

});
