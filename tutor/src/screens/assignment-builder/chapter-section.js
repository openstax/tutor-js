import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import { ChapterSectionMixin } from 'shared';
import _ from 'underscore';

export default createReactClass({
  displayName: 'ChapterSection',

  propTypes: {
    section: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.string,
    ]).isRequired,
  },

  UNSAFE_componentWillMount() {
    return this.setState({ skipZeros: false });
  },

  mixins: [ChapterSectionMixin],

  render() {
    const { section } = this.props;
    return (
      <span
        className="chapter-section"
        data-chapter-section={this.sectionFormat(section)}>
        {this.sectionFormat(section)}
      </span>
    );
  },
});
