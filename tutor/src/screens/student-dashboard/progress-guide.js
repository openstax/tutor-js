import { React, PropTypes, action, withRouter, modelize, observer } from 'vendor';
import { Button, Card } from 'react-bootstrap';
import { SpyMode } from 'shared';
import Router from '../../helpers/router';
import { isEmpty } from 'lodash';
import PerformanceForecastColorKey from '../../screens/performance-forecast/color-key';
import Section from '../../screens/performance-forecast/section';
import PracticeWeakestButton from '../../components/buttons/practice-weakest';

// Number of sections to display
const NUM_SECTIONS = 4;

// eslint-disable-next-line react/prefer-stateless-function
class ProgressGuide extends React.Component {

    static propTypes = {
        course: PropTypes.object,
    };

    render() {
        const { course } = this.props;
        const sections = course.performance.latestSections

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
@observer
export default
class ProgressGuideCards extends React.Component {
    static propTypes = {
        course: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);
        modelize(this);
        props.course.performance.fetch()
    }

    @action.bound viewPerformanceForecast() {
        return this.props.history.push(
            Router.makePathname('viewPerformanceGuide', { courseId: this.props.course.id })
        );
    }

    @action.bound viewMyPracticeQuestions() {
        return this.props.history.push(
            Router.makePathname('practiceQuestions', { courseId: this.props.course.id })
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
                        This area will fill in with topics as your assignments are graded.
                    </p>
                    <SpyMode.Content>
                        <ul>
                            <li>
                                {sections.length} sections were returned
                                by the performance forecast
                            </li>
                            {sections.map((section) =>
                                <li key={section.chapter_section.join('.')}>
                                    {section.chapter_section.join('.')}
                                    {' section.title'}
                                </li>)}
                        </ul>
                    </SpyMode.Content>
                </div>
            </Card>
        );
    }

    render() {
        const { performance } = this.props.course
        if (performance.api.isFetchInProgress) { return null }

        const recent = performance.latestSections

        if (isEmpty(recent)) { return this.renderEmpty(performance.periods[0].allSections); }

        return (
            <Card className="progress-guide">
                <div className="actions-box">
                    <ProgressGuide sections={recent} {...this.props} />
                    <PracticeWeakestButton courseId={this.props.course.id} />
                    <Button
                        variant="outline-secondary"
                        onClick={this.viewPerformanceForecast}
                        className="view-performance-forecast"
                        role="link"
                    >View All Topics</Button>
                    <Button
                        variant="outline-secondary"
                        onClick={this.viewMyPracticeQuestions}
                        className="view-my-practice-questions"
                        role="link"
                    >My Practice Questions</Button>
                </div>
            </Card>
        );
    }
}
