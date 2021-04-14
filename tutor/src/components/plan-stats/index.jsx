import { React, PropTypes, styled, observer, observable, computed, action } from 'vendor';
import { isEmpty, find } from 'lodash';
import { SmartOverflow } from 'shared';
import { TeacherTaskPlan, Course } from '../../models';
import CoursePeriodsNav from '../course-periods-nav';
import CourseBar from './course-bar';
import { ChaptersPerformance, PracticesPerformance } from './performances';
import LoadingScreen from 'shared/components/loading-animation';
import NoStudents from './no-students';
import RadioInput from  '../radio-input';

const SectionWrapper = styled.div`
  margin: 0.8rem 5rem 2rem 0;
  display: inline-flex;
`;

const StatsWrapper = styled.div`
  margin-top: 2rem;
  font-size: 1.6rem;

  section {
    margin-top: 0.8rem;
  }
`;

@observer
export default
class Stats extends React.Component {

    static propTypes = {
        plan: PropTypes.instanceOf(TeacherTaskPlan).isRequired,
        course: PropTypes.instanceOf(Course).isRequired,
        activeSection: PropTypes.string,
        initialActivePeriodIndex: PropTypes.number,
        handlePeriodSelect: PropTypes.func,
        shouldOverflowData: PropTypes.bool,
    };

    static defaultProps = {
        initialActivePeriodIndex: 0,
        shouldOverflowData: false,
    };

    @observable currentPeriodIndex = 0;

    @computed get course() {
        return this.props.course;
    }

    @computed get analytics() {
        return this.props.plan.analytics;
    }

    @computed get period() {
        return this.periods[this.currentPeriodIndex];
    }

    @computed get periods() {
        return this.props.plan.activeAssignedPeriods;
    }

    @computed get stats() {
        return find(this.analytics.stats, { period_id: this.period.id }) || {};
    }

    UNSAFE_componentWillMount() {
        if (!this.analytics.api.hasBeenFetched) {
            this.analytics.fetch();
        }
    }

    @action.bound handlePeriodSelect(period, index) {
        const { handlePeriodSelect } = this.props;
        this.currentPeriodIndex = index;
        if (handlePeriodSelect) { handlePeriodSelect(period); }
    }

    renderWithTabs(body) {
        return (
            <>
                <CoursePeriodsNav
                    handleSelect={this.handlePeriodSelect}
                    periods={this.course.periods}
                    course={this.course}
                />
                {body}
            </>
        );
    }

    renderCurrentPages() {
        if (isEmpty(this.stats.current_pages)) { return null; }
        return (
            <ChaptersPerformance
                currentPages={this.stats.current_pages}
                activeSection={this.props.activeSection} />
        );
    }

    renderSpacedPages() {
        if (isEmpty(this.stats.spaced_pages)) { return null; }
        return (
            <PracticesPerformance
                spacedPages={this.stats.spaced_pages}
                activeSection={this.props.activeSection} />
        );
    }

    render() {
        let courseBar, dataComponent;
        const { course, stats, props: { shouldOverflowData } } = this;

        if (!this.analytics.api.hasBeenFetched) {
            return <LoadingScreen />;
        }

        courseBar = <CourseBar data={stats} type={this.props.plan.type} />;

        if (shouldOverflowData) {
            dataComponent = <SmartOverflow className="task-stats-data" heightBuffer={24}>
                <section>
                    {courseBar}
                </section>
                {this.renderCurrentPages()}
                {this.renderSpacedPages()}
            </SmartOverflow>;
        } else {
            dataComponent = <StatsWrapper>
                <h6>Class progress</h6>
                <section>
                    {courseBar}
                </section>
            </StatsWrapper>;
        }

        return (
            <>
                <h6>Select section</h6>
                {this.periods.map((p, i) =>
                    <SectionWrapper key={`period-${p.id}`}>
                        <RadioInput
                            id={`period-${p.id}`}
                            name={`period-${p.id}`}
                            standalone={true}
                            onChange={() => this.handlePeriodSelect(p, i)}
                            checked={this.period.id === p.id}
                            label={p.name}
                            labelSize="lg"
                        />
                    </SectionWrapper>
                )}
                {!this.period.hasEnrollments && <NoStudents courseId={course.id} />}
                {this.period.hasEnrollments && dataComponent}
            </>
        );
    }
}
