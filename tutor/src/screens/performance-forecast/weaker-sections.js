import PropTypes from 'prop-types';
import React from 'react';
import * as PerformanceForecast from '../../flux/performance-forecast';
import Section from './section';

export default
class WeakerSections extends React.Component {
  static propTypes = {
      courseId:     PropTypes.string.isRequired,
      sections:     PropTypes.array.isRequired,
      weakerEmptyMessage:  PropTypes.string.isRequired,
  };

  renderLackingData = () => {
      return (
          <div className="lacking-data">
              {this.props.weakerEmptyMessage}
          </div>
      );
  };

  renderSections = () => {
      return PerformanceForecast.Helpers.weakestSections(this.props.sections).map((section, i) =>
          <Section key={i} section={section} {...this.props} />);
  };

  render() {
      return (
          <React.Fragment>
              {PerformanceForecast.Helpers.canDisplayWeakest(this.props) ? this.renderSections() : this.renderLackingData()}
          </React.Fragment>
      );
  }
}
