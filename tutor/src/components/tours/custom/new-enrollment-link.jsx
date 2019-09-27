import {
  React, PropTypes, withRouter, action,
} from 'vendor';
import StepPanel from './standard';
import Router from '../../../helpers/router';

export default
@withRouter
class NewEnrollmentLink extends React.Component {

  className = 'new-enrollment-link-wheel'

  static propTypes = {
    step: PropTypes.object.isRequired,
    ride: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  @action.bound onNavigate() {
    const { courseId } = this.props.ride.tour;
    this.props.history.push(
      Router.makePathname('courseSettings', { courseId })
    );
    this.props.ride.markComplete();
  }

  render() {
    const { step, ride } = this.props;

    return (
      <StepPanel
        step={step} ride={ride}
        buttons={[
          <button key="1" onClick={this.onNavigate}>Go to the new links</button>,
          <button key="2" onClick={ride.onNextStep}>I’ll get them later</button>,
        ]}
      />
    );
  }
}
