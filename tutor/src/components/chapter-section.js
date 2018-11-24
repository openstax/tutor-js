import PropTypes from 'prop-types';
import React from 'react';
import { ChapterSectionMixin } from 'shared';

export default function ChapterSection({ section }) {

  return (
    <span
      className="chapter-section"
      data-chapter-section={ChapterSectionMixin.sectionFormat(section)}>
      {ChapterSectionMixin.sectionFormat(section)}
    </span>
  );

}

ChapterSection.propTypes = {
  section: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string,
  ]).isRequired,
};
