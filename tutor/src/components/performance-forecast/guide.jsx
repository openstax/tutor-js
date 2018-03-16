import React from 'react';
import { Row } from 'react-bootstrap';

import _ from 'underscore';
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
    weakerExplanation: React.PropTypes.element
  };

  renderBody = () => {
    return <div className='guide-group'><WeakerPanel {...Object.assign({ "sections": this.props.allSections }, this.props)} /><Row><h3>Individual Chapters</h3></Row>{Array.from(this.props.chapters || []).map((chapter, i) => <Chapter {...Object.assign({ "key": i, "chapter": chapter }, this.props)} />)}</div>;
  };

  render() {
    let body;
    const className = classnames('guide-container', {
      'is-loading': typeof this.props.isLoading === 'function' ? this.props.isLoading() : undefined,
      'is-empty': _.isEmpty(this.props.allSections)
    });

    if (typeof this.props.isLoading === 'function' ? this.props.isLoading() : undefined) {
      body = this.props.loadingMessage;
    } else if (_.isEmpty(this.props.allSections)) {
      body = this.props.emptyMessage;
    } else {
      body = this.renderBody();
    }

    return <div className={className}>{this.props.heading}{body}</div>;
  }
};
