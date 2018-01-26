import React from 'react';
import { observer } from 'mobx-react';
import { computed, observable, action } from 'mobx';
import ContainerDimensions from 'react-container-dimensions';
import { isEmpty, get } from 'lodash';
import CoursePage from '../../components/course-page';
import ScoresTable from './table';
import TableFilters from './table-filters';
import NoPeriods from '../../components/no-periods';
import Courses from '../../models/courses-map';
import Export from './export';
import LmsPush from './lms-push';
import CoursePeriodsNav from '../../components/course-periods-nav';
import TourRegion from '../../components/tours/region';
import LoadingScreen from '../../components/loading-screen';
import './styles.scss';

@observer
export default class StudentScores extends React.PureComponent {

  static propTypes = {
    params: React.PropTypes.shape({
      courseId: React.PropTypes.string.isRequired,
    }).isRequired,
  }

  @computed get course() {
    return Courses.get(this.props.params.courseId);
  }

  @computed get period() {
    return this.course.scores.periods.get(
      this.course.periods.active[this.periodIndex].id
    );
  }

  @observable sortIndex;
  @observable periodIndex = 0;
  @observable sort = { key: 'name', asc: true, dataType: 'score' };
  @observable displayAs = 'percentage';

  componentWillMount() {
    this.course.scores.fetch();
  }

  @action.bound changeSortingOrder(key, dataType) {
    this.sort.asc = this.sort.key === key ? (!this.sort.asc) : false;
    this.sort.key = key;
    this.sort.dataType = dataType;
  }

  @action.bound selectPeriod(period, key) {
    this.periodIndex = key;
  }

  @action.bound changeDisplayAs(mode) {
    this.displayAs = mode;
  }

  @computed get data() {
    return this.course.scores.periods.get(this.period.id);
  }

  renderAfterTabsItem() {
    if (!get(this.period, 'students.length')) { return null; }

    if (this.course.is_concept_coach) {
      return (
        <span className="course-scores-note tab">
          Click on a student’s score to review their work.
          Click the icon to see their progress completing the assignment.
        </span>
      );
    }
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
        <TableFilters displayAs={this.displayAs} changeDisplayAs={this.changeDisplayAs} />
        <div className="spacer" />
        <LmsPush course={this.course} />
        <Export course={this.course} />
      </div>
    );
  }

  render() {

    const courseId = this.course.id;

    if (!this.course.scores.api.hasBeenFetched) {
      return <LoadingScreen className="course-scores-report" message="Loading Scores…" />;
    }

    if (isEmpty(this.course.periods.active)) {
      return <NoPeriods courseId={courseId} />;
    }

    return (
      <CoursePage
        course={this.course}
        className="course-scores-report"
        title="Student Scores"
        controls={this.renderControls()}
      >
        <CoursePeriodsNav
          handleSelect={this.selectPeriod}
          courseId={this.course.id}
          afterTabsItem={this.renderAfterTabsItem()}
        />
        <TourRegion id="scores" courseId={courseId} otherTours={['preview-scores']}>
          <ContainerDimensions>
            <ScoresTable
              period={this.period}
              sort={this.sort}
              onSort={this.changeSortingOrder}
              colSetWidth={this.colSetWidth}
              displayAs={this.displayAs}
              dataType={this.sort.dataType}
              isConceptCoach={this.course.is_concept_coach}
            />
          </ContainerDimensions>
        </TourRegion>
      </CoursePage>
    );
  }
}
