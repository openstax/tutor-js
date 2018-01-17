import { React, SnapShot, Wrapper } from '../../components/helpers/component-testing';
import { Modal } from 'react-bootstrap';
import bootstrapScores from '../../helpers/scores-data.js';
import UX from '../../../src/screens/scores-report/ux';
import SetWeightsModal from '../../../src/screens/scores-report/set-weights-modal';
import EnzymeContext from '../../components/helpers/enzyme-context';

describe('Scores Report: set weights modal', () => {

  let props;

  beforeEach(() => {
    const { course } = bootstrapScores();
    props = {
      ux: new UX(course),
    };
  });

  it('renders and matches snapshot', () => {
    props.ux.weights.isSetting = true
    const wrapper = mount(<SetWeightsModal {...props} />, EnzymeContext.build());
    const modal = wrapper.find(Modal)
    console.log(modal.nodes[0])
    // console.log(modal.node.portal)
    //   const modal = mount(<Modal {...props} />, EnzymeContext.build());
    // console.log(modal.find('Modal').at(1).instance)

    // console.log(modal.debug())
    // console.log(modal.instance().portal)
  });



});
