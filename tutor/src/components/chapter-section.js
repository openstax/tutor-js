import React from 'react';
import PropTypes from 'prop-types';
import ChapterSectionModel from '../models/chapter-section';

export default
function ChapterSection({ chapterSection }) {

  return (
    <span
      className="chapter-section"
      data-chapter-section={chapterSection.key}
    >
      {chapterSection.asString}
    </span>
  );

}

ChapterSection.propTypes = {
  chapterSection: PropTypes.instanceOf(ChapterSectionModel).isRequired,
};
