import {SnapShot} from '../../helpers/component-testing'
import { WelcomeToTutorWithCoachContent } from '../../../../src/components/tours/custom/welcome-to-tutor-with-coach';

describe('Welcome to Tutor with Coach', () => {
  it('matches snapshot for welcome to tutor with coach', () => {
    expect(SnapShot.create(<WelcomeToTutorWithCoachContent step={{ride:{}}} />).toJSON()).toMatchSnapshot();
  });

});
