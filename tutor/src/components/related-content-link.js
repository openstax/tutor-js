import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import _ from 'underscore';
import Courses from '../models/courses-map';
import { ChapterSectionMixin } from 'shared';
import { Icon } from 'shared';
import BrowseTheBook from './buttons/browse-the-book';


const RelatedContentLink = createReactClass({
  displayName: 'RelatedContentLink',

  propTypes: {
    courseId: PropTypes.string.isRequired,

    content: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        chapter_section: PropTypes.array.isRequired,
      }).isRequired
    ).isRequired,
  },

  mixins: [ChapterSectionMixin],

  render() {
    let content;
    if (_.isEmpty(this.props.content)) { return null; }

    return (
      <div className="related-content-link">
        <span className="preamble">
          {'Comes from '}
        </span>
        {(() => {
          const result = [];
          for (let i = 0; i < this.props.content.length; i++) {
            content = this.props.content[i];
            const section = this.sectionFormat(content.chapter_section);
            result.push(<BrowseTheBook
              key={i}
              unstyled={true}
              chapterSection={section}
              course={Courses.get(this.props.courseId)}
              tabIndex={-1}>
              <span className="part">
                <span className="section">
                  {section}
                  {' '}
                </span>
                <span className="title">
                  {content.title}
                </span>
              </span>
            </BrowseTheBook>);
          }
          return result;
        })()}
      </div>
    );
  },
});

export default RelatedContentLink;
