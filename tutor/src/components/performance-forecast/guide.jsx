import React from 'react';
import { Row } from 'react-bootstrap';

import { isEmpty, map } from 'lodash';
import classnames from 'classnames';

import Chapter from './chapter';
import Section from './section';
import ColorKey from './color-key';
import ProgressBar from './progress-bar';
import WeakerPanel from './weaker-panel';
import ChapterSectionType from './chapter-section-type';

export default class PerformanceForecast extends React.Component {

  static propTypes = {
    courseId: React.PropTypes.string.isRequired,
    roleId: React.PropTypes.string,
    allSections: React.PropTypes.array.isRequired,
    chapters: React.PropTypes.arrayOf(ChapterSectionType),
    heading: React.PropTypes.element,
    canPractice: React.PropTypes.bool,
    weakerTitle: React.PropTypes.string.isRequired,
    weakerExplanation: React.PropTypes.element,
  };

  renderBody = () => {
    return (
      <div className='guide-group'>
        <WeakerPanel
          {...this.props}
          sections={this.props.allSections}
        />
        <Row>
          <h3>Individual Chapters</h3>
        </Row>
        {
          map((this.props.chapters || []), (chapter, i) => (
              <Chapter
                {...this.props}
                chapter={chapter}
                key={i}
              />
            )
          )
        }
      </div>
    );
  };

  render() {
    let body;
    const className = classnames('guide-container', {
      'is-loading': typeof this.props.isLoading === 'function' ? this.props.isLoading() : undefined,
      'is-empty': isEmpty(this.props.allSections),
    });

    if (typeof this.props.isLoading === 'function' ? this.props.isLoading() : undefined) {
      body = this.props.loadingMessage;
    } else if (isEmpty(this.props.allSections)) {
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
};
