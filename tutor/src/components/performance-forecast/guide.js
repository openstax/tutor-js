import PropTypes from 'prop-types';
import React from 'react';
import BS from 'react-bootstrap';

import _ from 'underscore';
import classnames from 'classnames';

import Chapter from './chapter';
import Section from './section';
import ColorKey from './color-key';
import ProgressBar from './progress-bar';
import WeakerPanel from './weaker-panel';
import ChapterSectionType from './chapter-section-type';

export default class extends React.Component {
  static displayName = 'PerformanceForecast';

  static propTypes = {
    courseId:    PropTypes.string.isRequired,
    roleId:   PropTypes.string,
    allSections: PropTypes.array.isRequired,
    chapters:    PropTypes.arrayOf(ChapterSectionType),
    heading:     PropTypes.element,
    canPractice:  PropTypes.bool,
    weakerTitle: PropTypes.string.isRequired,
    weakerExplanation: PropTypes.element,
  };

  renderBody = () => {
    return (
      <div className="guide-group">
        <WeakerPanel sections={this.props.allSections} {...this.props} />
        <BS.Row>
          <h3>
            Individual Chapters
          </h3>
        </BS.Row>
        {(this.props.chapters || []).map((chapter, i) =>
          <Chapter key={i} chapter={chapter} {...this.props} />)}
      </div>
    );
  };

  render() {
    let body;
    const className = classnames(
      'guide-container',
      {
        'is-loading': (typeof this.props.isLoading === 'function' ? this.props.isLoading() : undefined),
        'is-empty': _.isEmpty(this.props.allSections),
      },
    );

    if ((typeof this.props.isLoading === 'function' ? this.props.isLoading() : undefined)) {
      body = this.props.loadingMessage;
    } else if (_.isEmpty(this.props.allSections)) {
      body = this.props.emptyMessage;
    } else {
      body = this.renderBody();
    }

    return (
      <div className={className}>
        {this.props.heading}
        {body}
      </div>
    );
  }
}
