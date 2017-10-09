import React from 'react';
import { Panel } from 'react-bootstrap';
import { computed, observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { map } from 'lodash';

import Tabs from '../tabs';
import Courses from '../../models/courses-map';
import TeacherRoster from './teacher-roster';
import StudentRoster from './student-roster';
import ViewArchivedPeriods from './view-archived-periods';
import TourRegion from '../tours/region';
import AddPeriodLink       from './add-period';
import RenamePeriodLink    from './rename-period';
import DeletePeriodLink    from './delete-period';
import DroppedRoster from './dropped-roster';
import CoursePage from '../course-page';


@observer
export default class CourseRoster extends React.PureComponent {

  static propTypes = {
    params: React.PropTypes.shape({
      courseId: React.PropTypes.string.isRequired,
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
    if (this.course.activePeriods[periodIndex]) {
      this.periodIndex = periodIndex;
    } else {
      ev.preventDefault();
    }
  }

  @action.bound selectPreviousPeriod() {
    let periodIndex;
    if (this.periodIndex > 0) {
      periodIndex = this.periodIndex - 1;
      if (periodIndex >= this.course.activePeriods.length - 1) {
        periodIndex = this.course.activePeriods.length - 2;
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
        course={this.course}
        button={<AddPeriodLink course={this.course} />}
      />
    );
  }

  renderControls(course) {
    return [
      <div key="name" className="course-settings-title">
        {course.name}
      </div>,
      <h4 key="term" className="course-settings-term">
        {course.termFull}
      </h4>,
    ];
  }

  render() {
    const { course, course: { activePeriods: periods } } = this;

    const activePeriod = periods[this.periodIndex];

    return (
      <CoursePage
        className="roster"
        title="Roster"
        course={course}
        controls={this.renderControls(course)}
      >
        <TourRegion
          id="course-settings"
          otherTours={['course-settings-preview']}
          courseId={course.id}
        >
          <div className="settings-section teachers">
            <TeacherRoster course={course} />
          </div>

          <div className="roster">
            <div className="settings-section periods">
              <Tabs ref="tabs" tabs={map(periods, 'name')} onSelect={this.onTabSelection}>
                <AddPeriodLink show={false} course={course} />
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
        </TourRegion>
      </CoursePage>
    );
  }
}
