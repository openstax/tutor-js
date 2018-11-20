import { React, observable, observer, action } from '../../helpers/react';
import PropTypes from 'prop-types';
import twix from 'twix';
import TourAnchor from '../../components/tours/anchor';

@observer
class CoursePlanLabel extends React.Component {

  static propTypes = {
    plan: PropTypes.shape({
      title: PropTypes.string.isRequired,
      opensAt: PropTypes.string,
    }).isRequired,
  };


  render() {
    const { plan } = this.props;

    return (
      <TourAnchor id="calendar-task-plan">
        <label
          data-opens-at={plan.opensAt}
          data-title={plan.title}
        >
          {plan.title}
        </label>
      </TourAnchor>
    );
  }
}

export default CoursePlanLabel;
