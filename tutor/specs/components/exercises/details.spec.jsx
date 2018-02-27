/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
jest.mock('../../../src/helpers/exercise');
const ExerciseHelpers = require('../../../src/helpers/exercise');

const {React, Testing, _, ReactTestUtils} = require('../helpers/component-testing');

const ExerciseDetails = require('../../../src/components/exercises/details');

const EXERCISES = require('../../../api/exercises');
const ECOSYSTEM_ID = '1';

describe('Exercise Details Component', function() {
  let props = {};
  let errorLinkSpy = null;

  beforeEach(function() {
    errorLinkSpy = jest.fn();
    return (
        props = {
          courseId: '1',
          ecosystemId: ECOSYSTEM_ID,
          selectedExercise: EXERCISES.items[0],
          exercises: {grouped: { '1.1': EXERCISES.items} },
          onExerciseToggle:      jest.fn(),
          onShowCardViewClick:   jest.fn(),
          getExerciseActions:    jest.fn(() => (({
            'report-error': {
              message: 'Report an error',
              handler: errorLinkSpy
            }
            }))),
          getExerciseIsSelected: jest.fn().mockReturnValue(false)
        }
    );
  });

  it('sends current exercise along when showing card view', () =>
    Testing.renderComponent( ExerciseDetails, {props} ).then(({dom}) => {
      Testing.actions.click(dom.querySelector('.show-cards'));
      return (
          expect(props.onShowCardViewClick).toHaveBeenCalledWith(expect.anything(), props.selectedExercise)
      );
    })
  );

  return (

      it('links to error url form', function() {
        const details = mount(<ExerciseDetails {...props} />)

  );
    expect(details).toHaveRendered('.action.report-error');
    details.find('.action.report-error').simulate('click'); //prop('onClick')()
    expect(errorLinkSpy).toHaveBeenCalledWith(expect.anything(), props.selectedExercise);
    return (
        undefined
    );
  });
});
