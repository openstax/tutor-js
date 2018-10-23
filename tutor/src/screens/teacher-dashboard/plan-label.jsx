import { React, observable, observer, action } from '../../helpers/react';
import PropTypes from 'prop-types';
import twix from 'twix';
import TourAnchor from '../../components/tours/anchor';

@observer
class CoursePlanLabel extends React.Component {

  static propTypes = {
    rangeDuration: PropTypes.instanceOf(twix).isRequired,
    plan: PropTypes.shape({
      title: PropTypes.string.isRequired,
      durationLength: PropTypes.number.isRequired,
      opensAt: PropTypes.string,
    }).isRequired,
    offsetFromPlanStart: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    offset: PropTypes.number.isRequired,
  };

  calcPercentOfPlanLength = (partLength) => {
    return (
      ((partLength / this.props.plan.durationLength) * 100) + '%'
    );
  };

  render() {
    let label, labelClass;
    const { rangeDuration, plan, index, offset, offsetFromPlanStart } = this.props;
    const { opensAt, title } = plan;

    // Adjust width based on plan duration, helps with label centering on view...for the most part.
    // CALENDAR_EVENT_LABEL_DYNAMIC_WIDTH
    const planRangeLength = rangeDuration.length('days');
    const planLabelStyle = {
      width: this.calcPercentOfPlanLength(planRangeLength),
      marginLeft: this.calcPercentOfPlanLength(offsetFromPlanStart),
    };

    if (index !== 0) { labelClass = 'continued'; }

    return (
      label = <TourAnchor id="calendar-task-plan">
        <label
          data-opens-at={opensAt}
          data-title={title}
          style={planLabelStyle}
          className={labelClass}>
          {title}
        </label>
      </TourAnchor>
    );
  }
}

export default CoursePlanLabel;
