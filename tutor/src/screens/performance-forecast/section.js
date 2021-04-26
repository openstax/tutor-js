import PropTypes from 'prop-types';
import React from 'react';
import BookPartTitle from '../../components/book-part-title';
import ChapterSectionType from './chapter-section-type';
import ProgressBar from './progress-bar';
import Statistics from './statistics';
import { ChapterSection } from '../../models';

const PerformanceForecastSection = (props) => {
    const { course, roleId, section } = props;
    const cs = new ChapterSection(section.chapter_section);
    return (
        <div className="section">
            <h4 className="heading">
                <span className="number">
                    {cs.asString}
                </span>
                <span className="title">
                    <BookPartTitle part={section} />
                </span>
            </h4>
            <ProgressBar
                {...props}
                ariaLabel={`${cs.asString} ${section.title}`} />
            <Statistics
                course={course}
                roleId={roleId}
                section={section}
                displaying="section" />
        </div>
    );
};

PerformanceForecastSection.propTypes = {
    course:   PropTypes.object.isRequired,
    roleId:   PropTypes.string,
    section:  ChapterSectionType.isRequired,
    canPractice: PropTypes.bool,
};

export default PerformanceForecastSection;
