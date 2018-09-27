import React from 'react';
import createReactClass from 'create-react-class';
import Router from 'react-router-dom';
import { ChapterSectionMixin } from 'shared';
import ChapterSectionType from './chapter-section-type';
import ProgressBar from './progress-bar';
import Statistics from './statistics';

export default createReactClass({

  displayName: 'PerformanceForecastSection',

  propTypes: {
    courseId: React.PropTypes.string.isRequired,
    roleId: React.PropTypes.string,
    section: ChapterSectionType.isRequired,
    canPractice: React.PropTypes.bool,
  },

  mixins: [ChapterSectionMixin],

  render() {
    const { courseId, section } = this.props;

    return (
      <div className='section'>
        <h4 className='heading'>
          <span className='number'>
            {this.sectionFormat(section.chapter_section)}
          </span>
          <span className='title' title={section.title}>
            {section.title}
          </span>
        </h4>
        <ProgressBar
          {...this.props}
          ariaLabel={`${this.sectionFormat(section.chapter_section)} ${section.title}`}
        />
        <Statistics
          courseId={this.props.courseId}
          roleId={this.props.roleId}
          section={section}
          displaying='section'
        />
      </div>
    );
  }
});
