import React from 'react';
import PropTypes from 'prop-types';
import { ChapterSectionMixin } from 'shared';
import ChapterSectionModel from '../models/chapter-section';

export default
function ChapterSection({ chapterSection }) {

  return (
    <span
      className="chapter-section"
      data-chapter-section={ChapterSectionMixin.sectionFormat(section)}
    >
      {ChapterSectionMixin.sectionFormat(section)}
    </span>
  );

}

ChapterSection.propTypes = {
  chapterSection: PropTypes.instanceOf(ChapterSectionModel).isRequired,
};
