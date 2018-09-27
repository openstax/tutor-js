import React from 'react';
import Router from 'react-router-dom';
import { map } from 'lodash';

import { ChapterSectionMixin } from 'shared';

import ChapterSectionType from './chapter-section-type';
import ProgressBar from './progress-bar';
import Section from './section';
import Statistics from './statistics';

export default class PerformanceForecastChapter extends React.Component {

  static propTypes = {
    courseId: React.PropTypes.string.isRequired,
    roleId: React.PropTypes.string,
    chapter: ChapterSectionType.isRequired,
    canPractice: React.PropTypes.bool,
  };

  render() {
    const { chapter, courseId } = this.props;

    return (
      <div className='chapter-panel'>
        <div className='chapter'>
          <div className='heading'>
            <span className='number'>
              {chapter.chapter_section[0]}
            </span>
            <div className='title' title={chapter.title}>
              {chapter.title}
            </div>
          </div>
          <ProgressBar
            {...this.props}
            section={chapter}
          />
          <Statistics
            courseId={this.props.courseId}
            roleId={this.props.roleId}
            section={chapter}
            displaying='chapter'
          />
        </div>
        <div
          ref='sections'
          className='sections'
        >
          {
            map(chapter.children, (section, i) => (
                <Section
                  {...this.props}
                  section={section}
                  key={i}
                />
              )
            )
          }
        </div>
      </div>
    );
  }
};
