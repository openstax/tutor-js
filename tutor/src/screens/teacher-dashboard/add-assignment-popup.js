import { React, observer, cn, action } from '../../helpers/react';
import PropTypes from 'prop-types';
import { Dropdown } from 'react-bootstrap';
import moment from 'moment';
import _ from 'underscore';
import Course from '../../models/course';
import { TimeStore } from '../../flux/time';
import TimeHelper from '../../helpers/time';
import Time from '../../models/time';

import AddMenu from './add-menu';

export default
@observer
class AddAssignmentPopUp extends React.Component {

  static propTypes = {
    course: PropTypes.instanceOf(Course).isRequired,
    termStart:  TimeHelper.PropTypes.moment,
    termEnd:    TimeHelper.PropTypes.moment,
  }

  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  addMenu = new AddMenu({ router: this.context.router });
  //
  //   state = {
  //     positionLeft: 0,
  //     positionTop: 0,
  //     open: false,
  //     referenceDate: moment(TimeStore.getNow()),
  //   }
  //
  //   @action.bound updateState(date, x, y) {
  //     this.setState({
  //       addDate: date,
  //       positionLeft: x,
  //       positionTop: y,
  //       open: true,
  //     });
  //   }
  //
  //   @action.bound close() {
  //     this.setState({
  //       addDate: null,
  //       open: false,
  //     });
  //   }
  //

  get dateType() {
    const { date, termStart, termEnd } = this.props;

    if (date.isBefore(termStart, 'day')) {
      return (
        'day before term starts'
      );
    } else if (date.isAfter(termEnd, 'day')) {
      return (
        'day after term ends'
      );
    } else if (date.isBefore(Time.now, 'day')) {
      return (
        'past day'
      );
    }
  }

  render() {
    let dropdownContent;
    const { date, x, y } = this.props;

    if (!date) { return null; }

    // DYNAMIC_ADD_ON_CALENDAR_POSITIONING
    // Positions Add menu on date
    const style = {
      left: x,
      top: y,
    };

    const addDateType = this.dateType;
    const className = cn('course-add-dropdown', { 'no-add': addDateType });

    // only allow add if addDate is on or after reference date
    dropdownContent = addDateType ? (
      <li>
        <span className="no-add-text">Cannot assign to {addDateType}</span>
      </li>
    ) : this.addMenu.render(this.props);


    return (
      <Dropdown.Menu
        show
        id="course-add-dropdown"
        ref="addOnDayMenu"
        style={style}
        className={className}
      >
        {dropdownContent}
      </Dropdown.Menu>
    );
  }
};
