import PropTypes from 'prop-types';
import React from 'react';
import ChapterSectionType from './chapter-section-type';
import BookPartTitle from '../../components/book-part-title';
import ProgressBar from './progress-bar';
import Section from './section';
import Statistics from './statistics';

const PerformanceForecastChapter = (props) => {
  const { chapter, roleId, courseId } = props;

  return (
    <div className="chapter-panel">
      <div className="chapter">
        <div className="heading">
          <span className="number">
            {chapter.chapter_section[0]}
          </span>
          <div className="title" title={chapter.title}>
            <BookPartTitle part={chapter} />
          </div>
        </div>
        <ProgressBar {...props} section={chapter} />
        <Statistics
          courseId={courseId}
          roleId={roleId}
          section={chapter}
          displaying="chapter" />
      </div>
      {chapter.children.map((section, i) =>
        <Section key={i} section={section} {...props} />)}
    </div>
  );
};

PerformanceForecastChapter.propTypes = {
  courseId: PropTypes.string.isRequired,
  roleId:   PropTypes.string,
  chapter:  ChapterSectionType.isRequired,
  canPractice: PropTypes.bool,
};

export default PerformanceForecastChapter;
