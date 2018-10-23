import PropTypes from 'prop-types';
import React from 'react';
import BS from 'react-bootstrap';
import Icon from '../icon';
import SectionPerformance from './section-performance';
import ChapterSection from '../task-plan/chapter-section';

import SectionProgress from './section-progress';

class Section extends React.Component {
  static displayName = 'Section';

  static propTypes = {
    section: PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      chapter_section: PropTypes.array,
      valid_sections: PropTypes.array,
      original_performance: PropTypes.number,
      spaced_practice_performance: PropTypes.spaced_practice_performance,
    }),
  };

  render() {
    let spacedPractice, spacedPracticeClass;
    if (typeof(this.props.section.spaced_practice_performance) !== 'undefined') {
      spacedPractice = <SectionPerformance performance={this.props.section.spaced_practice_performance} />;
    } else {
      spacedPracticeClass = 'empty-spaced-practice';
      spacedPractice = <Icon type="ellipsis-h" />;
    }

    return (
      <BS.Row className="section" key={this.props.section.id}>
        <BS.Col xs={6}>
          <ChapterSection skipZeros={false} section={this.props.section.chapter_section} />
          {this.props.section.title}
        </BS.Col>
        <BS.Col xs={2}>
          <SectionProgress section={this.props.section} />
        </BS.Col>
        <BS.Col xs={2}>
          <SectionPerformance performance={this.props.section.original_performance} />
        </BS.Col>
        <BS.Col xs={2} className={spacedPracticeClass}>
          {spacedPractice}
        </BS.Col>
      </BS.Row>
    );
  }
}

export default Section;
