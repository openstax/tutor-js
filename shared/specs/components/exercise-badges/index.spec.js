import { Testing, expect, sinon, _, ReactTestUtils } from 'shared/specs/helpers';
import ld from 'lodash';
import Badges from 'components/exercise-badges';

import EXERCISE from '../../../api/exercise-preview/data';

describe('Exercise Preview Component', function() {

  beforeEach(function() {
    return this.props = {
      exercise: ld.cloneDeep(EXERCISE),
    };});

  it('doesnt render if no items were found', function() {
    this.props.exercise.has_interactive = false;
    this.props.exercise.has_video = false;
    this.props.exercise.content.questions = [ this.props.exercise.content.questions[0] ];
    return Testing.renderComponent( Badges, { props: this.props } ).then(({ dom }) => expect(dom).not.to.exist);
  });

  it('renders interactive embed', function() {
    this.props.exercise.has_interactive = true;
    return Testing.renderComponent( Badges, { props: this.props } ).then(({ dom }) => expect( dom.querySelector('.interactive') ).to.exist);
  });

  it('renders for video', function() {
    this.props.exercise.has_video = true;
    return Testing.renderComponent( Badges, { props: this.props } ).then(({ dom }) => expect( dom.querySelector('.video') ).to.exist);
  });

  return it('renders for MPQs', function() {
    this.props.exercise.content.questions.push(ld.cloneDeep(this.props.exercise.content.questions[0]));
    return Testing.renderComponent( Badges, { props: this.props } ).then(({ dom }) => expect( dom.querySelector('.mpq') ).to.exist);
  });
});
