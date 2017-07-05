import {SnapShot} from '../../helpers/component-testing'
import { LookingForCoachContent } from '../../../../src/components/tours/custom/looking-for-coach';

describe('Looking for Coach', () => {
  it('matches snapshot for looking for coach', () => {
    expect(SnapShot.create(<LookingForCoachContent step={{ride:{}}} />).toJSON()).toMatchSnapshot();
  });

});
