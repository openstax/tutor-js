import { React, PropTypes, observer, computed, action, modelize } from 'vendor';
import { isEmpty, get } from 'lodash';
import { ScrollToTop } from 'shared';
import CoursePage from '../../components/course-page';
import ScoresTable from './table';
import TableFilters from './table-filters';
import NoPeriods from '../../components/no-periods';
import { currentCourses } from '../../models';
import ScoresReportExportControls from './export-controls';
import ScoresReportNav from './nav';
import DroppedStudentsCaption from './dropped-students-caption';
import TourRegion from '../../components/tours/region';
import LoadingScreen from 'shared/components/loading-animation';

import './styles.scss';
import UX from './ux';

@observer
export default
class StudentScores extends React.Component {
    static propTypes = {
        params: PropTypes.shape({
            courseId: PropTypes.string.isRequired,
        }).isRequired,
        ux: PropTypes.instanceOf(UX),
    }

    constructor(props) {
        super(props);
        modelize(this);
    }

    @computed get course() {
        return currentCourses.get(this.props.params.courseId);
    }

    ux = this.props.ux || new UX(this.course);

    @computed get title() {
        return (this.course.currentRole.isTeacher && 'Student Scores') || 'Scores';
    }

    UNSAFE_componentWillMount() {
        this.course.scores.fetch();
    }

    @action.bound selectPeriod(period, key) {
        this.ux.periodIndex = key;
    }

    renderAfterTabsItem() {
        if (!get(this.ux.period, 'students.length')) { return null; }

        return (
            <span className="course-scores-note tab">
        Scores reflect work submitted on time.
        To accept late work, click the orange triangle.
            </span>
        );
    }

    renderControls() {
        return (
            <div className="controls">
                <TableFilters ux={this.ux} />
                <ScoresReportExportControls course={this.course}/>
            </div>
        );
    }

    render() {
        const courseId = this.course.id;
        let pending = null;

        if (!this.course.scores.api.hasBeenFetched) {
            pending = (
                <LoadingScreen
                    className="course-scores-report"
                    message="Loading Scores…" />
            );
        }

        if (isEmpty(this.course.periods.active)) {
            pending = <NoPeriods courseId={courseId} />;
        }

        return pending || (
            <ScrollToTop>
                <CoursePage
                    course={this.course}
                    title={this.title}
                    className="course-scores-report"
                    controls={this.renderControls()}
                    fullWidthChildren={
                        <TourRegion
                            id="scores"
                            className="scores-table"
                            courseId={courseId}
                            otherTours={['preview-scores']}
                        >
                            <ScoresTable ux={this.ux} />
                            <DroppedStudentsCaption ux={this.ux} />
                        </TourRegion>
                    }
                >
                    <ScoresReportNav
                        course={this.course}
                        handleSelect={this.selectPeriod}
                        afterTabsItem={this.renderAfterTabsItem()}
                    />
                </CoursePage>
            </ScrollToTop>
        );
    }
}
