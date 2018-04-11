import { React, observable, observer, action } from '../../helpers/react';
import twix from 'twix';
import TourAnchor from '../../components/tours/anchor';

@observer
class CoursePlanLabel extends React.Component {

  static propTypes = {
    rangeDuration: React.PropTypes.instanceOf(twix).isRequired,
    plan: React.PropTypes.shape({
      title: React.PropTypes.string.isRequired,
      durationLength: React.PropTypes.number.isRequired,
      opensAt: React.PropTypes.string,
    }).isRequired,
    offsetFromPlanStart: React.PropTypes.number.isRequired,
    index: React.PropTypes.number.isRequired,
    offset: React.PropTypes.number.isRequired,
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
