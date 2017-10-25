import React from 'react';

import { Link } from 'react-router-dom';

export default class BackButton extends React.PureComponent {

  static propTypes = {
    isEditable: React.PropTypes.bool.isRequired,
    getBackToCalendarParams: React.PropTypes.func.isRequired,
  }

  render() {
    if (this.props.isEditable) { return null; }

    const backToCalendarParams = this.props.getBackToCalendarParams();

    return (
      <Link {...backToCalendarParams} className="btn btn-default">
        Back to Calendar
      </Link>
    );
  }
}
