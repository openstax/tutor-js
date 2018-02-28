import { Testing, expect, sinon, _, ReactTestUtils } from 'shared/specs/helpers';
import ld from 'lodash';
import Badges from 'components/exercise-badges';

import EXERCISE from '../../../api/exercise-preview/data';

describe('Exercise Preview Component', function() {
  let props = null;
  beforeEach(function() {
    props = {
      exercise: ld.cloneDeep(EXERCISE),
    };});

  it('doesnt render if no items were found', function() {
    props.exercise.has_interactive = false;
    props.exercise.has_video = false;
    props.exercise.content.questions = [ props.exercise.content.questions[0] ];
    return Testing.renderComponent( Badges, { props: props } ).then(({ dom }) => expect(dom).not.to.exist);
  });

  it('renders interactive embed', function() {
    props.exercise.has_interactive = true;
    return Testing.renderComponent( Badges, { props: props } ).then(({ dom }) => expect( dom.querySelector('.interactive') ).to.exist);
  });

  it('renders for video', function() {
    props.exercise.has_video = true;
    return Testing.renderComponent( Badges, { props: props } ).then(({ dom }) => expect( dom.querySelector('.video') ).to.exist);
  });

  return it('renders for MPQs', function() {
    props.exercise.content.questions.push(ld.cloneDeep(props.exercise.content.questions[0]));
    return Testing.renderComponent( Badges, { props: props } ).then(({ dom }) => expect( dom.querySelector('.mpq') ).to.exist);
  });
});
