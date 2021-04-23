import PropTypes from 'prop-types';
import React from 'react';
import { filter } from 'lodash';
import ChapterSectionType from './chapter-section-type';
import BookPartTitle from '../../components/book-part-title';
import ProgressBar from './progress-bar';
import Section from './section';
import Statistics from './statistics';

const PerformanceForecastChapter = (props) => {
    const { chapter, roleId, course } = props;

    return (
        <div className="chapter-panel">
            <div className="chapter">
                <div className="heading">
                    <span className="number">
                        {chapter.chapter_section.chapter}
                    </span>
                    <div className="title" title={chapter.title}>
                        <BookPartTitle part={chapter} />
                    </div>
                </div>
                <ProgressBar {...props} section={chapter} />
                <Statistics
                    course={course}
                    roleId={roleId}
                    section={chapter}
                    displaying="chapter"
                />
            </div>
            {filter(chapter.children, 'clue.is_real').map((section, i) =>
                <Section key={i} section={section} {...props} />)}
        </div>
    );
};

PerformanceForecastChapter.propTypes = {
    course:   PropTypes.object.isRequired,
    roleId:   PropTypes.string,
    chapter:  ChapterSectionType.isRequired,
    canPractice: PropTypes.bool,
};

export default PerformanceForecastChapter;
