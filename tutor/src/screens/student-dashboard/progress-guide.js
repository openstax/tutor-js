import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import { Button } from 'react-bootstrap';
import { SpyMode } from 'shared';
import Router from '../../helpers/router';
import LoadableItem from '../../components/loadable-item';
import { isEmpty } from 'lodash';
import * as PerformanceForecast from '../../flux/performance-forecast';
import { ChapterSectionMixin } from 'shared';
import PerformanceForecastColorKey from '../../components/performance-forecast/color-key';
import Section from '../../components/performance-forecast/section';
import PracticeWeakestButton from '../../components/performance-forecast/weakest-practice-button';

// Number of sections to display
const NUM_SECTIONS = 4;

class ProgressGuide extends React.Component {

  static propTypes = {
    courseId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
  };

  render() {
    const { courseId } = this.props;
    const guide = PerformanceForecast.Student.store.get(courseId);
    const sections = PerformanceForecast.Helpers.recentSections(
      PerformanceForecast.Student.store.getAllSections(courseId)
    );

    return (
      <div className="progress-guide">
        <h2 className="panel-title">
          Performance Forecast
        </h2>
        <h3 className="recent">
          Recent topics
        </h3>
        <div className="guide-group">
          <div className="chapter-panel">
            {sections.map((section, i) =>
              <Section key={i} section={section} canPractice={true} {...this.props} />)}
          </div>
        </div>
        <PerformanceForecastColorKey />
      </div>
    );
  }
}


const ProgressGuideCards = createReactClass({
  displayName: 'ProgressGuideCards',

  contextTypes: {
    router: PropTypes.object,
  },

  propTypes: {
    courseId: PropTypes.string.isRequired,
  },

  mixins: [ChapterSectionMixin],

  viewPerformanceForecast() {
    return this.context.router.history.push(
      Router.makePathname('viewPerformanceGuide', this.props)
    );
  },

  renderEmpty(sections) {
    return (
      <div className="progress-guide panel empty">
        <div className="actions-box">
          <h1 className="panel-title">
            Performance Forecast
          </h1>
          <p>
            {`\
  The performance forecast is an estimate of your current understanding of a topic.
  It is a personalized display based on your answers to reading questions,
  homework problems, and previous practices.\
  `}
          </p>
          <p>
            {'\
      This area will fill in with topics as you complete your assignments\
      '}
          </p>
          <SpyMode.Content>
            <ul>
              <li>
                {sections.length}
                {' sections were returned by the performance forecast'}
              </li>
              {sections.map((section) =>
                <li>
                  {this.sectionFormat(section.chapter_section)}
                  {' section.title'}
                </li>)}
            </ul>
          </SpyMode.Content>
        </div>
      </div>
    );
  },

  render() {
    const sections = PerformanceForecast.Student.store.getAllSections(this.props.courseId);
    const recent = PerformanceForecast.Helpers.recentSections(sections);
    if (isEmpty(recent)) { return this.renderEmpty(sections); }

    return (
      <div className="progress-guide panel">
        <div className="actions-box">
          <ProgressGuide sections={recent} {...this.props} />
          <PracticeWeakestButton courseId={this.props.courseId} />
          <Button
            role="link"
            onClick={this.viewPerformanceForecast}
            className="view-performance-forecast"
            role="link">
            {'\
    View All Topics\
    '}
          </Button>
        </div>
      </div>
    );
  },
});

export default class extends React.Component {
  static displayName = 'ProgressGuideShell';

  static propTypes = {
    courseId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
  };

  renderLoading = (refreshButton) => {
    return (
      <div className="actions-box loadable is-loading">
        {'\
    Loading progress information... '}
        {refreshButton}
      </div>
    );
  };

  render() {
    return (
      <LoadableItem
        id={this.props.courseId}
        store={PerformanceForecast.Student.store}
        renderLoading={this.renderLoading}
        actions={PerformanceForecast.Student.actions}
        renderItem={() => {
          return <ProgressGuideCards {...this.props} />;
        }} />
    );
  }
}
