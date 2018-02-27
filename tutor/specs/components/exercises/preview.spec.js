import { React, SnapShot } from '../helpers/component-testing';
import ExercisePreviewWrapper from '../../../src/components/exercises/preview';

import Factory from '../../factories';
import Sequence from 'object-factory-bot/sequences';

describe('Exercise Preview Wrapper Component', function() {
  let exercise, props;

  beforeEach(() => {
    exercise = Factory.tutorExercise();
    Sequence.map.clear();

    props = {
      exercise,
      onShowDetailsViewClick: jest.fn(),
      onExerciseToggle:       jest.fn(),
      getExerciseIsSelected:  jest.fn(),
      getExerciseActions:     jest.fn().mockReturnValue({}),
    };
  });


  it('renders', () => {
    const preview = mount(<ExercisePreviewWrapper {...props} />);
    expect(preview.debug()).toMatchSnapshot();
  });

  it('re-renders when model is updated', () => {
    const preview = mount(<ExercisePreviewWrapper {...props} />);
    const answer = preview.find('ArbitraryHtmlAndMath').at(1).props().html ; //.map(e => e.debug())
    expect(answer).toEqual(exercise.content.questions[0].stem_html);
    exercise.content.questions[0].stem_html = 'THIS IS UPDATE!';
    expect(
      preview.find('ArbitraryHtmlAndMath').at(1).props().html
    ).toEqual('THIS IS UPDATE!');
  });

});
