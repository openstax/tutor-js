import PropTypes from 'prop-types';
import React from 'react';
import { computed, observable, action, modelize } from 'shared/model'
import { observer } from 'mobx-react';
import { map } from 'lodash';
import Tabs from '../../components/tabs';
import CourseBreadcrumb from '../../components/course-breadcrumb';
import { currentCourses } from '../../models';
import TeacherRoster from './teacher-roster';
import StudentRoster from './student-roster';
import ViewArchivedPeriods from './view-archived-periods';
import AddPeriodLink       from './add-period';
import RenamePeriodLink    from './rename-period';
import DeletePeriodLink    from './delete-period';
import DroppedRoster from './dropped-roster';
import CoursePage from '../../components/course-page';
import NoPeriods from '../../components/no-periods';
import './styles.scss';

@observer
export default
class CourseRoster extends React.Component {
    static propTypes = {
        params: PropTypes.shape({
            courseId: PropTypes.string.isRequired,
        }).isRequired,
    }


    constructor(props) {
        super(props);
        modelize(this);
    }


    @computed get course() {
        console.log(this.props.params.courseId)
        currentCourses.array.forEach(c => console.log(c.id) )

        return currentCourses.get(this.props.params.courseId);
    }

    componentDidMount() {
        this.course.roster.fetch();
    }

    @observable periodIndex = 0;

    @action.bound onTabSelection(periodIndex, ev) {
        if (this.course.periods.active[periodIndex]) {
            this.periodIndex = periodIndex;
        } else {
            ev.preventDefault();
        }
    }

    @action.bound selectPreviousPeriod() {
        let periodIndex;
        if (this.periodIndex > 0) {
            periodIndex = this.periodIndex - 1;
            if (periodIndex >= this.course.periods.active.length - 1) {
                periodIndex = this.course.periods.active.length - 2;
            }
        } else {
            periodIndex = 0;
        }
        this.periodIndex = periodIndex;
    }

    renderEmpty() {
        if (!this.course) {
            return null;
        }
        return (
            <NoPeriods
                courseId={this.course.id}
                button={<AddPeriodLink course={this.course} />}
            />
        );
    }

    renderTitleBreadcrumbs() {
        return <CourseBreadcrumb course={this.course} currentTitle="Course Roster" noBottomMargin />;
    }

    render() {
        const { course } = this;
        let periods = [];
        // course can be null when a teacher removes themselves and this
        // re-renders before the redirect to dashboard occurs
        if (course) {
            periods = course.periods.active;
        }
        if (0 === periods.length) { return this.renderEmpty(); }
        const activePeriod = periods[this.periodIndex] || periods[0];

        return (
            <CoursePage
                className="roster"
                course={course}
                titleBreadcrumbs={this.renderTitleBreadcrumbs()}
                titleAppearance="light"
                controlBackgroundColor='white'
            >
                <div className="settings-section teachers">
                    <TeacherRoster course={course} />
                </div>

                <div className="roster">
                    <div className="settings-section periods">
                        <Tabs
                            tabs={map(periods, 'name')}
                            selectedIndex={this.periodIndex}
                            onSelect={this.onTabSelection}
                        >
                            <AddPeriodLink course={course} />
                            <ViewArchivedPeriods course={course} onComplete={this.selectPreviousPeriod} />
                        </Tabs>
                        <div className="active-period">
                            <div className="period-edit-controls">
                                <span className="spacer" />
                                <RenamePeriodLink course={course} period={activePeriod} />
                                <DeletePeriodLink
                                    course={course}
                                    period={activePeriod}
                                    onDelete={this.selectPreviousPeriod} />
                            </div>

                            <StudentRoster period={activePeriod} />

                            <DroppedRoster course={course} />
                        </div>
                    </div>
                </div>
            </CoursePage>
        );
    }
}
