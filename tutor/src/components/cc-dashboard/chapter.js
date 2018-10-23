import _ from 'underscore';
import PropTypes from 'prop-types';
import React from 'react';
import BS from 'react-bootstrap';
import classnames from 'classnames';

import { CCDashboardStore } from '../../flux/cc-dashboard';
import ChapterSection from '../task-plan/chapter-section';
import Section from './section';

class DashboardChapter extends React.Component {
  static displayName = 'DashboardChapter';

  static propTypes = {
    chapter: PropTypes.shape({
      id: PropTypes.string,
      chapter_section: PropTypes.array,
      valid_sections: PropTypes.array,
    }),
  };

  renderSections = () => {
    return _.map(this.props.chapter.valid_sections, (section, index) => <Section id={section.id} section={section} key={index} />);
  };

  render() {
    const classes = classnames('chapter', { empty: this.props.chapter.valid_sections });
    return (
      <div className={classes} data-chapter-id={this.props.chapter.id}>
        <BS.Row className="name" key={this.props.chapter.id}>
          <BS.Col xs={12}>
            <ChapterSection section={this.props.chapter.chapter_section} />
            {this.props.chapter.title}
          </BS.Col>
        </BS.Row>
        {this.renderSections()}
      </div>
    );
  }
}

export default DashboardChapter;
