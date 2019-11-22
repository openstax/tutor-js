import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import { partial } from 'lodash';
import { Listing, Choice } from '../../components/choices-listing';
import OfferingUnavailable from './offering-unavail';
import BuilderUX from './ux';

export default
@observer
class SelectDates extends React.Component {

  static title = 'When will you teach this course?';

  static propTypes = {
    ux: PropTypes.instanceOf(BuilderUX).isRequired,
  }

  @action.bound
  onSelect(term) {
    this.props.ux.newCourse.term = term;
  }

  render() {
    const { ux, ux: { offering } } = this.props;
    if (!offering) {
      return <OfferingUnavailable />;
    }

    return (
      <Listing>
        {offering.validTerms.map((term, index) =>
          <Choice
            key={index}
            active={term.isEqual(ux.newCourse.term)}
            onClick={partial(this.onSelect, term)}
          >
            <span className="term">
              {term.term}
            </span>
            <span className="year">
              {term.year}
            </span>
          </Choice>)}
      </Listing>
    );
  }
}
