import PropTypes from 'prop-types';
import React from 'react';
import { computed, observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { map } from 'lodash';
import Tabs from '../../components/tabs';
import Courses from '../../models/courses-map';
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

export default
@observer
class CourseRoster extends React.Component {

  static propTypes = {
    params: PropTypes.shape({
      courseId: PropTypes.string.isRequired,
    }).isRequired,
  }


  @computed get course() {
    return Courses.get(this.props.params.courseId);
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
    this.refs.tabs.selectTabIndex(periodIndex);
  }

  renderEmpty() {
    return (
      <NoPeriods
        courseId={this.course.id}
        button={<AddPeriodLink course={this.course} />}
      />
    );
  }

  render() {
    const { course, course: { periods: { active: periods } } } = this;
    if (0 === periods.length) { return this.renderEmpty(); }
    const activePeriod = periods[this.periodIndex];

    return (
      <CoursePage
        className="roster"
        title="Course roster"
        course={course}
      >
        <div className="course-settings-title">
          {course.name}
        </div>
        <h4 className="course-settings-term">
          {course.termFull}
        </h4>
        <div className="settings-section teachers">
          <TeacherRoster course={course} />
        </div>

        <div className="roster">
          <div className="settings-section periods">
            <Tabs ref="tabs" tabs={map(periods, 'name')} onSelect={this.onTabSelection}>
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
