import PropTypes from 'prop-types';
import React from 'react';
import ChapterSectionType from './chapter-section-type';
import ProgressBar from './progress-bar';
import Section from './section';
import Statistics from './statistics';


export default class extends React.Component {
  static displayName = 'PerformanceForecastChapter';

  static propTypes = {
    courseId: PropTypes.string.isRequired,
    roleId:   PropTypes.string,
    chapter:  ChapterSectionType.isRequired,
    canPractice: PropTypes.bool,
  };

  render() {
    const { chapter, courseId } = this.props;

    return (
      <div className="chapter-panel">
        <div className="chapter">
          <div className="heading">
            <span className="number">
              {chapter.chapter_section[0]}
            </span>
            <div className="title" title={chapter.title}>
              {chapter.title}
            </div>
          </div>
          <ProgressBar {...this.props} section={chapter} />
          <Statistics
            courseId={this.props.courseId}
            roleId={this.props.roleId}
            section={chapter}
            displaying="chapter" />
        </div>

        {chapter.children.map((section, i) =>
          <Section key={i} section={section} {...this.props} />)}

      </div>
    );
  }
}
