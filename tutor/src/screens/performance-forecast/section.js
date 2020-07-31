import PropTypes from 'prop-types';
import React from 'react';
import BookPartTitle from '../../components/book-part-title';
import ChapterSectionType from './chapter-section-type';
import ProgressBar from './progress-bar';
import Statistics from './statistics';
import ChapterSection from '../../models/chapter-section';

const PerformanceForecastSection = (props) => {
  const { courseId, roleId, section } = props;
  const cs = new ChapterSection(section.chapter_section);
  return (
    <div className="section">
      <h4 className="heading">
        <span className="number">
          {cs.asString}
        </span>
        <span className="title" title={section.title}>
          <BookPartTitle part={section} />
        </span>
      </h4>
      <ProgressBar
        {...props}
        ariaLabel={`${cs.asString} ${section.title}`} />
      <Statistics
        courseId={courseId}
        roleId={roleId}
        section={section}
        displaying="section" />
    </div>
  );
};

PerformanceForecastSection.propTypes = {
  courseId: PropTypes.string.isRequired,
  roleId:   PropTypes.string,
  section:  ChapterSectionType.isRequired,
  canPractice: PropTypes.bool,
};

export default PerformanceForecastSection;
