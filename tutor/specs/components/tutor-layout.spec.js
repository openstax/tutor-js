import { Router as R } from '../helpers';
import { TutorLayout } from '../../src/components/tutor-layout';
import TC from '../../src/components/tours/conductor';
import { SpyMode as SM } from 'shared';

describe('Tutor Layout', () => {

  it('renders and matches snapshot', () => {
    const l = mount(
      <R><SM.Wrapper><TC>
        <TutorLayout><p>hi i am body</p></TutorLayout>
      </TC></SM.Wrapper></R>
    );
    expect(l.debug()).toMatchSnapshot();
    l.unmount();
  });

});
