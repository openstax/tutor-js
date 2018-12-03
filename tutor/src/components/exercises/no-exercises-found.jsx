import React from 'react';
import ScrollTo from '../../helpers/scroll-to';

export default class NoExercisesFound extends React.Component {

  scroller = new ScrollTo();

  componentDidMount() {
    this.scroller.scrollToSelector('.no-exercises-found');
  }

  render() {
    return (
      <div className="no-exercises-found">
        <h3>
          No exercises were found for the given sections.
        </h3>
        <p className="lead">
          Please select additional sections and retry
        </p>
      </div>
    );
  }

}
