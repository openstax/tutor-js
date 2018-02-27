import { React, SnapShot } from '../helpers/component-testing';

import Cards from '../../../src/components/exercises/cards';
import { map } from 'lodash';
// import { ExerciseActions, ExerciseStore } from '../../../src/flux/exercise';

import FakeWindow from 'shared/specs/helpers/fake-window';
import Factory from '../../factories';
jest.mock('../../../../shared/src/components/html');
import EXERCISES from '../../../api/exercises';
const ECOSYSTEM_ID = '1';

const PAGE_IDS = [1, 2, 3];
describe('Exercise Cards Component', function() {

  let exercises, props, book;

  beforeEach(() => {
    book = Factory.book();
    const pageIds = book.pages.byId.keys();
    exercises = Factory.exercisesMap({ ecosystem_id: ECOSYSTEM_ID, page_ids: pageIds, count: 4 });
    props = {
      book,
      exercises,
      pageIds,
      ecosystemId: ECOSYSTEM_ID,
      onExerciseToggle:       jest.fn(),
      getExerciseIsSelected:  jest.fn().mockReturnValue(false),
      getExerciseActions:     jest.fn().mockReturnValue({}),
      onShowDetailsViewClick: jest.fn(),
      windowImpl: new FakeWindow,
    };
  });

  it('renders and matches snapshot', () => {
    const component = SnapShot.create(<Cards {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
  });

});
