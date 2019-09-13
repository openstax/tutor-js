import WelcomeToTutorContent from '../../../../src/components/tours/custom/instructor-welcome-to-tutor';

describe('Welcome to Tutor', () => {
  it('matches snapshot for welcome to tutor', () => {
    expect.snapshot(<WelcomeToTutorContent step={{ }} ride={{ }} />).toMatchSnapshot();
  });

});
