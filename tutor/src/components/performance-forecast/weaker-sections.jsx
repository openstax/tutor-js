import React from 'react';
import Router from 'react-router-dom';
import _ from 'underscore';

import PerformanceForecast from '../../flux/performance-forecast';
import Section from './section';

class WeakerSections extends React.Component {
  static propTypes = {
    courseId: React.PropTypes.string.isRequired,
    sections: React.PropTypes.array.isRequired,
    weakerEmptyMessage: React.PropTypes.string.isRequired
  };

  renderLackingData = () => {
    return <div className='lacking-data'>{this.props.weakerEmptyMessage}</div>;
  };

  renderSections = () => {
    return Array.from(PerformanceForecast.Helpers.weakestSections(this.props.sections)).map((section, i) => <Section {...Object.assign({ "key": i, "section": section }, this.props)} />);
  };

  render() {
    return <div className='sections'>{PerformanceForecast.Helpers.canDisplayWeakest(this.props) ? this.renderSections() : this.renderLackingData()}</div>;
  }
}

export default WeakerSections;
