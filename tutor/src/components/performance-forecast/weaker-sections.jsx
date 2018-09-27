import React from 'react';
import Router from 'react-router-dom';
import { map } from 'lodash';

import PerformanceForecast from '../../flux/performance-forecast';
import Section from './section';

class WeakerSections extends React.Component {
  static propTypes = {
    courseId: React.PropTypes.string.isRequired,
    sections: React.PropTypes.array.isRequired,
    weakerEmptyMessage: React.PropTypes.string.isRequired,
  };

  renderLackingData = () => (
    <div className='lacking-data'>
      {this.props.weakerEmptyMessage}
    </div>
  );

  renderSections = () => (
    map(PerformanceForecast.Helpers.weakestSections(this.props.sections), (section, i) => (
        <Section
          {...this.props}
          section={section}
          key={i}
        />
      )
    )
  );

  render() {
    return (
      <div className='sections'>
        {
          PerformanceForecast.Helpers.canDisplayWeakest(this.props) ? this.renderSections() : this.renderLackingData()
        }
      </div>
    );
  }
}

export default WeakerSections;
