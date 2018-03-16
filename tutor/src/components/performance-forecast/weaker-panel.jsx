import React from 'react';
import Router from 'react-router-dom';

import PerformanceForecast from '../../flux/performance-forecast';
import PracticeButton from './practice-button';
import WeakerSections from './weaker-sections';
import PracticeWeakestButton from './weakest-practice-button';

class WeakerPanel extends React.Component {
  static propTypes = {
    courseId: React.PropTypes.string.isRequired,
    sections: React.PropTypes.array.isRequired,
    weakerTitle: React.PropTypes.string.isRequired,
    weakerExplanation: React.PropTypes.element.isRequired,
    weakerEmptyMessage: React.PropTypes.string.isRequired,
    canPractice: React.PropTypes.bool,
    sectionCount: React.PropTypes.number
  };

  render() {
    // Do not render if we have no sections
    let practiceBtn;
    if (this.props.sections.length === 0) {
      return null;
    }
    // Only show the practice button if practice is allowed and weakest sections exit
    if (this.props.canPractice && PerformanceForecast.Helpers.canDisplayWeakest(this.props)) {
      practiceBtn = <PracticeWeakestButton title='Practice All' courseId={this.props.courseId} />;
    }

    return <div className="chapter-panel weaker"><div className='chapter metric'><span className='title'>{this.props.weakerTitle}</span>{this.props.weakerExplanation}{practiceBtn}</div><WeakerSections {...Object.assign({}, this.props)} /></div>;
  }
}

export default WeakerPanel;
