import { React, PropTypes, action, withRouter } from '../../helpers/react';
import { Button, Card } from 'react-bootstrap';
import { SpyMode } from 'shared';
import Router from '../../helpers/router';
import LoadableItem from '../../components/loadable-item';
import { isEmpty } from 'lodash';
import * as PerformanceForecast from '../../flux/performance-forecast';
import PerformanceForecastColorKey from '../../screens/performance-forecast/color-key';
import Section from '../../screens/performance-forecast/section';
import PracticeWeakestButton from '../../components/buttons/practice-weakest';

// Number of sections to display
const NUM_SECTIONS = 4;

// eslint-disable-next-line react/prefer-stateless-function
class ProgressGuide extends React.Component {

  static propTypes = {
    courseId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
  };

  render() {
    const { courseId } = this.props;
    const sections = PerformanceForecast.Helpers.recentSections(
      PerformanceForecast.Student.store.getAllSections(courseId)
    );

    return (
      <Card className="progress-guide">
        <h2>
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
      </Card>
    );
  }
}

@withRouter
class ProgressGuideCards extends React.Component {

  static propTypes = {
    courseId: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
  }

  @action.bound viewPerformanceForecast() {
    return this.props.history.push(
      Router.makePathname('viewPerformanceGuide', this.props)
    );
  }

  renderEmpty(sections) {
    return (
      <Card className="progress-guide empty">
        <div className="actions-box">
          <h2>
            Performance Forecast
          </h2>
          <p>
            The performance forecast is an estimate of your
            current understanding of a topic.
            It is a personalized display based on your answers
            to reading questions, homework problems,
            and previous practices.
          </p>
          <p>
            This area will fill in with topics as you
            complete your assignments
          </p>
          <SpyMode.Content>
            <ul>
              <li>
                {sections.length} sections were returned
                by the performance forecast
              </li>
              {sections.map((section) =>
                <li>
                  {section.chapter_section.asString}
                  {' section.title'}
                </li>)}
            </ul>
          </SpyMode.Content>
        </div>
      </Card>
    );
  }

  render() {
    const sections = PerformanceForecast.Student.store.getAllSections(this.props.courseId);
    const recent = PerformanceForecast.Helpers.recentSections(sections);
    if (isEmpty(recent)) { return this.renderEmpty(sections); }

    return (
      <Card className="progress-guide">
        <div className="actions-box">
          <ProgressGuide sections={recent} {...this.props} />
          <PracticeWeakestButton courseId={this.props.courseId} />
          <Button
            variant="outline-secondary"
            onClick={this.viewPerformanceForecast}
            className="view-performance-forecast"
            role="link"
          >View All Topics</Button>
        </div>
      </Card>
    );
  }
}

export default
class ProgressGuideShell extends React.Component {

  static propTypes = {
    courseId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
  };

  renderLoading = (refreshButton) => {
    return (
      <div className="actions-box loadable is-loading">
        Loading progress information...
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
