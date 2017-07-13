import { SnapShot } from '../../helpers/component-testing';
import { WelcomeToTutorContent } from '../../../../src/components/tours/custom/instructor-welcome-to-tutor';

describe('Welcome to Tutor', () => {
  it('matches snapshot for welcome to tutor', () => {
    expect(SnapShot.create(<WelcomeToTutorContent step={{ ride: {} }} />).toJSON()).toMatchSnapshot();
  });

});
