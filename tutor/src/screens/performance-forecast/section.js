import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import ChapterSectionType from './chapter-section-type';
import ProgressBar from './progress-bar';
import Statistics from './statistics';
import ChapterSection from '../../models/chapter-section';

export default createReactClass({
  displayName: 'PerformanceForecastSection',

  propTypes: {
    courseId: PropTypes.string.isRequired,
    roleId:   PropTypes.string,
    section:  ChapterSectionType.isRequired,
    canPractice: PropTypes.bool,
  },

  render() {
    const { section } = this.props;
    const cs = new ChapterSection(section.chapter_section);
    return (
      <div className="section">
        <h4 className="heading">
          <span className="number">
            {cs.asString}
          </span>
          <span className="title" title={section.title}>
            {section.title}
          </span>
        </h4>
        <ProgressBar
          {...this.props}
          ariaLabel={`cs.asString ${section.title}`} />
        <Statistics
          courseId={this.props.courseId}
          roleId={this.props.roleId}
          section={section}
          displaying="section" />
      </div>
    );
  },
});
